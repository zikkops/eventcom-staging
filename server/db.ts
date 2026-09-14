import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { databaseUrl } from "./env";
import type { EventInput } from "./eventData";

// Rows come back as plain objects (not arrays, not full result metadata).
type Sql = NeonQueryFunction<false, false>;

let client: Sql | null = null;

/** Neon's query function. Each query is one HTTPS request, so there's no connection pool to manage. */
export function db(): Sql {
  if (!databaseUrl) throw new Error("DATABASE_URL isn't set.");
  client ??= neon(databaseUrl, { arrayMode: false, fullResults: false });
  return client;
}

const json = (value: unknown) => JSON.stringify(value);

// Shared by the admin panel and the setup script. They return the query
// unsent, so they can also go into sql.transaction([...]).

export const insertEvent = (sql: Sql, event: EventInput, position: number) => sql`
  INSERT INTO events (position, slug, brand, kicker, hero_image, card_image, vimeo_id, video,
    vertical_album, album, films)
  VALUES (${position}, ${event.slug}, ${event.brand}, ${event.kicker}, ${event.heroImage},
    ${event.cardImage}, ${event.vimeoId}, ${event.video}, ${event.verticalAlbum},
    ${json(event.album)}::jsonb, ${json(event.films)}::jsonb)`;

export const updateEvent = (sql: Sql, id: number, event: EventInput) => sql`
  UPDATE events SET slug = ${event.slug}, brand = ${event.brand}, kicker = ${event.kicker},
    hero_image = ${event.heroImage}, card_image = ${event.cardImage}, vimeo_id = ${event.vimeoId},
    video = ${event.video}, vertical_album = ${event.verticalAlbum},
    album = ${json(event.album)}::jsonb, films = ${json(event.films)}::jsonb, updated_at = now()
  WHERE id = ${id}`;

export const upsertSettings = (sql: Sql, settings: unknown) => sql`
  INSERT INTO site_settings (id, data) VALUES (1, ${json(settings)}::jsonb)
  ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
