"use client";

import { useActionState, useState } from "react";
import { slugify, vimeoIdFrom, type EventInput } from "@/server/eventData";
import { saveEvent } from "../actions";
import { FilmsField, vimeoHint } from "./FilmsField";
import { GalleryField } from "./GalleryField";
import { ImageField } from "./ImageField";
import { Field, inputClass, SaveBar, Section } from "./ui";

type Kind = "page" | "film";

export function EventEditor({ id, initial }: { id: number | null; initial: EventInput }) {
  const [event, setEvent] = useState(initial);
  const [kind, setKind] = useState<Kind>(initial.vimeoId ? "film" : "page");
  // A new event's address follows its brand until someone types their own.
  const [slugEdited, setSlugEdited] = useState(id !== null);
  const [result, action, pending] = useActionState(saveEvent, null);
  const update = (changes: Partial<EventInput>) => setEvent((current) => ({ ...current, ...changes }));

  const hasFilms = event.films.some((film) => vimeoIdFrom(film.vimeoId));

  return (
    <form action={action} className="adm-stack">
      <input type="hidden" name="id" value={id ?? ""} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="data" value={JSON.stringify(event)} />

      <Section title="Card" hint="How the event appears on the Work page.">
        <div className="adm-grid-2">
          <Field label="Brand">
            <input
              required
              value={event.brand}
              onChange={(e) =>
                update({ brand: e.target.value, ...(slugEdited ? {} : { slug: slugify(e.target.value) }) })
              }
              className={inputClass}
            />
          </Field>
          <Field
            label="Web address"
            hint={
              kind === "page"
                ? `The page lives at /work/${event.slug || "…"}. Changing it breaks links already shared.`
                : "Kept for the record; film lightbox events have no page."
            }
          >
            <input
              value={event.slug}
              onChange={(e) => {
                setSlugEdited(true);
                update({ slug: e.target.value });
              }}
              onBlur={() => update({ slug: slugify(event.slug) })}
              className={inputClass}
            />
          </Field>
        </div>
        <ImageField
          label="Card photo"
          hint="16:9 works best. Leave empty to use the main photo of the page."
          value={event.cardImage}
          removable
          onChange={(cardImage) => update({ cardImage })}
        />
      </Section>

      <Section title="When someone clicks the card">
        <div className="adm-choice">
          <label>
            <input type="radio" name="kind-choice" checked={kind === "page"} onChange={() => setKind("page")} />
            <span className="adm-choice-text">
              <span className="adm-strong">Open the event page</span>
              <span className="adm-hint">A page with a main photo, films and a photo album.</span>
            </span>
          </label>
          <label>
            <input type="radio" name="kind-choice" checked={kind === "film"} onChange={() => setKind("film")} />
            <span className="adm-choice-text">
              <span className="adm-strong">Play a film in a lightbox</span>
              <span className="adm-hint">No event page: the card plays one Vimeo film.</span>
            </span>
          </label>
        </div>

        {kind === "film" && (
          <Field label="Vimeo link" hint={vimeoHint(event.vimeoId, "Paste the link from Vimeo's Share button.")}>
            <input
              value={event.vimeoId}
              placeholder="https://vimeo.com/1222695290"
              onChange={(e) => update({ vimeoId: e.target.value })}
              className={inputClass}
            />
          </Field>
        )}
      </Section>

      {kind === "page" && (
        <Section title="Event page">
          <Field label="Small heading" hint="The label above the brand name, e.g. Selected Work.">
            <input value={event.kicker} onChange={(e) => update({ kicker: e.target.value })} className={inputClass} />
          </Field>
          <ImageField
            label="Main photo"
            hint="The large photo at the top of the page."
            value={event.heroImage}
            removable
            onChange={(heroImage) => update({ heroImage })}
          />
          <FilmsField value={event.films} onChange={(films) => update({ films })} />
          <GalleryField
            label="Photo album"
            hint={
              hasFilms
                ? "Hidden on the site while this event has films, and kept in case they are removed."
                : "Drag photos into place, or use the arrows."
            }
            value={event.album}
            onChange={(album) => update({ album })}
          />
          <label className="adm-check">
            <input
              type="checkbox"
              checked={event.verticalAlbum}
              onChange={(e) => update({ verticalAlbum: e.target.checked })}
            />
            Portrait photos (taller album tiles)
          </label>
        </Section>
      )}

      <SaveBar pending={pending} result={result} label={id ? "Save event" : "Create event"} />
    </form>
  );
}
