"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { sizedImage } from "@/lib/imageUrl";
import { deleteEvent, reorderEvents } from "../actions";
import { ConfirmSubmit } from "./ConfirmSubmit";
import { DragHandle } from "./DragHandle";
import { dangerButtonClass, secondaryButtonClass } from "./ui";

export type EventRow = {
  id: number;
  brand: string;
  slug: string;
  cardImage: string;
  opensFilm: boolean;
  films: number;
  photos: number;
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * The events in the order the Work page shows them. Drag a row by its grip,
 * or use the arrows — which also work by keyboard and on touch screens, where
 * dragging isn't available.
 */
export function EventList({ events }: { events: EventRow[] }) {
  const [rows, setRows] = useState(events);
  const [source, setSource] = useState(events);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [handleHeld, setHandleHeld] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  // Take the server's order again whenever the page re-renders with new data.
  if (source !== events) {
    setSource(events);
    setRows(events);
  }

  const canReorder = rows.length > 1;

  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return rows;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    return next;
  }

  function save(order: EventRow[]) {
    const data = new FormData();
    data.set("order", order.map((row) => row.id).join(","));
    setSaved(false);
    startTransition(async () => {
      await reorderEvents(data);
      setSaved(true);
    });
  }

  if (rows.length === 0) {
    return <p className="adm-empty">No events yet.</p>;
  }

  return (
    <>
      {canReorder && (
        <p className="adm-hint" style={{ marginBottom: 8 }}>
          Grab an event by its grip to drag it into place, or use the arrows.
          {pending && <span className="adm-pending"> Saving new order…</span>}
          {!pending && saved && <span className="adm-ok adm-strong"> Order saved</span>}
        </p>
      )}

      <ul onDragOver={(event) => event.preventDefault()} className="adm-list">
        {rows.map((row, index) => (
          <li
            key={row.id}
            draggable={handleHeld}
            onDragStart={(event) => {
              setDragIndex(index);
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragEnter={() => {
              if (dragIndex === null || dragIndex === index) return;
              move(dragIndex, index);
              setDragIndex(index);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setHandleHeld(false);
              save(rows);
            }}
            className={dragIndex === index ? "adm-dragging" : undefined}
          >
            {canReorder && <DragHandle onHold={setHandleHeld} />}
            <span className="adm-list-num">{index + 1}</span>

            {row.cardImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sizedImage(row.cardImage, 200)} alt="" draggable={false} className="adm-list-thumb" />
            ) : (
              <div className="adm-list-thumb" />
            )}

            <div className="adm-list-body">
              <p className="adm-strong">
                {row.brand}
                <span className={`adm-badge${row.opensFilm ? " adm-badge-film" : ""}`}>
                  {row.opensFilm ? "Film lightbox" : "Page"}
                </span>
              </p>
              <p className="adm-hint">
                {row.opensFilm
                  ? "The card plays the film; there is no event page"
                  : [
                      `/work/${row.slug}`,
                      row.films > 0 && plural(row.films, "film"),
                      row.photos > 0 && plural(row.photos, "photo"),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </p>
            </div>

            <div className="adm-row-tight">
              {canReorder && (
                <>
                  <button
                    type="button"
                    aria-label={`Move ${row.brand} up`}
                    disabled={index === 0}
                    onClick={() => save(move(index, index - 1))}
                    className={secondaryButtonClass}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${row.brand} down`}
                    disabled={index === rows.length - 1}
                    onClick={() => save(move(index, index + 1))}
                    className={secondaryButtonClass}
                  >
                    ↓
                  </button>
                </>
              )}
              {!row.opensFilm && (
                <Link href={`/work/${row.slug}`} target="_blank" draggable={false} className={secondaryButtonClass}>
                  View ↗
                </Link>
              )}
              <Link href={`/admin/events/${row.id}`} draggable={false} className={secondaryButtonClass}>
                Edit
              </Link>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={row.id} />
                <ConfirmSubmit
                  className={dangerButtonClass}
                  message={`Delete ${row.brand} and its photos? This can't be undone.`}
                >
                  Delete
                </ConfirmSubmit>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
