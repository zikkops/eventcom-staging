import type { EventFilm, EventItem } from "../data/events";
import { isImageKitUrl, sizedImage } from "../lib/imageUrl";

// Pure data shaping, shared by the site, the admin panel and the setup script.

/** One event as the database and the admin editor hold it: every field present. */
export type EventInput = {
  slug: string;
  brand: string;
  kicker: string;
  heroImage: string;
  cardImage: string;
  /** Set for an event with no inner page: its card opens this film in a lightbox. */
  vimeoId: string;
  /** A self-hosted film in public/, shown on the inner page. */
  video: string;
  verticalAlbum: boolean;
  album: string[];
  films: EventFilm[];
};

export type EventRecord = EventInput & { id: number; position: number };

export const DEFAULT_KICKER = "Selected Work";

// Photos must come from our ImageKit uploads or the repo's own public/ folder.
const LOCAL_IMAGE = /^\/(?!.*\.\.)[\w\-./]+\.(?:jpe?g|png|webp|avif|gif)$/i;
const LOCAL_VIDEO = /^\/(?!.*\.\.)[\w\-./]+\.(?:mp4|webm)$/i;

export const isLocalImage = (src: string) => LOCAL_IMAGE.test(src);
export const isAllowedImage = (src: string) => isImageKitUrl(src) || isLocalImage(src);

/** Accepts a bare id or any vimeo.com link, e.g. "https://vimeo.com/1222695290?share=copy". */
export function vimeoIdFrom(value: string) {
  const text = value.trim();
  if (/^\d+$/.test(text)) return text;
  return text.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1] ?? "";
}

/** "Van Cleef & Arpels" → "van-cleef-and-arpels" */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const emptyEvent = (): EventInput => ({
  slug: "",
  brand: "",
  kicker: DEFAULT_KICKER,
  heroImage: "",
  cardImage: "",
  vimeoId: "",
  video: "",
  verticalAlbum: false,
  album: [],
  films: [],
});

/** Coerces untrusted JSON (a form post or a database row) into a safe event. */
export function normalizeEvent(raw: unknown): EventInput {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === "string" ? value : "");
  const image = (value: unknown) => {
    const src = str(value).trim();
    return src && isAllowedImage(src) ? src : "";
  };
  const video = str(source.video).trim();

  return {
    slug: slugify(str(source.slug)),
    brand: str(source.brand).trim(),
    kicker: str(source.kicker).trim(),
    heroImage: image(source.heroImage),
    cardImage: image(source.cardImage),
    vimeoId: vimeoIdFrom(str(source.vimeoId)),
    video: LOCAL_VIDEO.test(video) ? video : "",
    verticalAlbum: source.verticalAlbum === true,
    album: (Array.isArray(source.album) ? source.album : []).map(image).filter(Boolean),
    // Films without a Vimeo id are kept, so the save action can point at them.
    films: (Array.isArray(source.films) ? source.films : []).map((entry) => {
      const film = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
      return {
        vimeoId: vimeoIdFrom(str(film.vimeoId)),
        title: str(film.title).trim(),
        poster: image(film.poster),
        vertical: film.vertical === true,
      };
    }),
  };
}

export function rowToEvent(row: Record<string, unknown>): EventRecord {
  return {
    id: Number(row.id),
    position: Number(row.position),
    ...normalizeEvent({
      slug: row.slug,
      brand: row.brand,
      kicker: row.kicker,
      heroImage: row.hero_image,
      cardImage: row.card_image,
      vimeoId: row.vimeo_id,
      video: row.video,
      verticalAlbum: row.vertical_album,
      album: row.album,
      films: row.films,
    }),
  };
}

/** The built-in data/events.ts entry, in the database's shape; used to seed it. */
export const eventFromItem = (item: EventItem): EventInput => ({
  slug: item.slug,
  brand: item.brand,
  kicker: item.kicker,
  heroImage: item.heroImage,
  cardImage: item.cardImage,
  vimeoId: item.vimeoId ?? "",
  video: item.video ?? "",
  verticalAlbum: item.verticalAlbum ?? false,
  album: item.album,
  films: (item.films ?? []).map((film) => ({ ...film, vertical: film.vertical ?? false })),
});

/**
 * What the site's components render. Empty optional fields are dropped, a
 * missing card or hero photo borrows the other one, and ImageKit photos are
 * requested at the width each place actually shows them.
 */
export function toEventItem(event: EventInput): EventItem {
  const card = event.cardImage || event.heroImage;
  const hero = event.heroImage || event.cardImage;
  const films = event.films
    .filter((film) => film.vimeoId)
    .map((film) => ({ ...film, poster: sizedImage(film.poster || card, 1280) }));

  return {
    slug: event.slug,
    brand: event.brand,
    kicker: event.kicker,
    heroImage: sizedImage(hero, 1920),
    cardImage: sizedImage(card, 1280),
    album: event.album.map((src) => sizedImage(src, 1600)),
    ...(event.video && { video: event.video }),
    ...(event.verticalAlbum && { verticalAlbum: true }),
    ...(event.vimeoId && { vimeoId: event.vimeoId }),
    ...(films.length > 0 && { films }),
  };
}

/** Every string anywhere inside `value` that passes `test`. */
export function collectStrings(value: unknown, test: (text: string) => boolean, into = new Set<string>()) {
  if (typeof value === "string") {
    if (test(value)) into.add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, test, into);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, test, into);
  }
  return into;
}

export const imageUrlsIn = (value: unknown) => collectStrings(value, isImageKitUrl);
