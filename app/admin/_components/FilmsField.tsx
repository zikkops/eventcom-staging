"use client";

import { useState } from "react";
import type { EventFilm } from "@/data/events";
import { vimeoIdFrom } from "@/server/eventData";
import { DragHandle } from "./DragHandle";
import { ImageField } from "./ImageField";
import { dangerButtonClass, Field, inputClass, labelClass, secondaryButtonClass } from "./ui";

const blankFilm = (): EventFilm => ({ vimeoId: "", title: "", poster: "", vertical: false });

/** Explains what was understood from a pasted Vimeo link. */
export function vimeoHint(value: string, empty: string) {
  if (!value.trim()) return empty;
  const id = vimeoIdFrom(value);
  return id ? `Vimeo film ${id}.` : "That doesn't look like a Vimeo link.";
}

/** The films on an event page. Drag one by its grip, or use the arrows. */
export function FilmsField({ value, onChange }: { value: EventFilm[]; onChange: (films: EventFilm[]) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  // A film only becomes draggable while the pointer is held on its grip.
  const [handleHeld, setHandleHeld] = useState(false);

  const canReorder = value.length > 1;
  const replace = (index: number, changes: Partial<EventFilm>) =>
    onChange(value.map((film, i) => (i === index ? { ...film, ...changes } : film)));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="adm-stack-sm" onDragOver={(event) => event.preventDefault()}>
      <span className={labelClass}>Films</span>
      <p className="adm-hint">
        Each film shows on the event page behind its poster. An event with films shows them instead
        of its photo album.
      </p>

      {value.map((film, index) => (
        <div
          key={index}
          draggable={handleHeld}
          onDragStart={() => setDragIndex(index)}
          onDragEnter={() => {
            if (dragIndex === null || dragIndex === index) return;
            move(dragIndex, index);
            setDragIndex(index);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setHandleHeld(false);
          }}
          className={`adm-subcard${dragIndex === index ? " adm-dragging" : ""}`}
        >
          <div className="adm-row adm-between">
            <span className="adm-row adm-strong" style={{ gap: 8 }}>
              {canReorder && <DragHandle onHold={setHandleHeld} />}
              Film {index + 1}
            </span>
            <span className="adm-row-tight">
              <button
                type="button"
                aria-label="Move film up"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                className={secondaryButtonClass}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move film down"
                disabled={index === value.length - 1}
                onClick={() => move(index, index + 1)}
                className={secondaryButtonClass}
              >
                ↓
              </button>
              <button
                type="button"
                aria-label="Remove film"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className={dangerButtonClass}
              >
                ✕
              </button>
            </span>
          </div>

          <div className="adm-grid-2">
            <Field label="Vimeo link" hint={vimeoHint(film.vimeoId, "Paste the link from Vimeo's Share button.")}>
              <input
                value={film.vimeoId}
                placeholder="https://vimeo.com/1222695290"
                onChange={(event) => replace(index, { vimeoId: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Title" hint="Shown on the poster and in the player.">
              <input
                value={film.title}
                onChange={(event) => replace(index, { title: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <ImageField
            label="Poster"
            hint="Leave empty to use the card photo."
            value={film.poster}
            removable
            onChange={(poster) => replace(index, { poster })}
          />
          <label className="adm-check">
            <input
              type="checkbox"
              checked={film.vertical === true}
              onChange={(event) => replace(index, { vertical: event.target.checked })}
            />
            Portrait film (9:16), opened in an upright frame
          </label>
        </div>
      ))}

      <button
        type="button"
        className={secondaryButtonClass}
        style={{ alignSelf: "flex-start" }}
        onClick={() => onChange([...value, blankFilm()])}
      >
        + Add film
      </button>
    </div>
  );
}
