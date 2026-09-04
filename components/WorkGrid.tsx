"use client";

import Link from "next/link";
import { useState } from "react";
import type { EventItem } from "@/data/events";
import VideoLightbox from "./VideoLightbox";

export default function WorkGrid({ events }: { events: EventItem[] }) {
  const [film, setFilm] = useState<EventItem | null>(null);

  return (
    <>
      <div className="brand-card-grid">
        {events.map((event) => {
          const style = {
            "--image": `url('${event.cardImage}')`,
          } as React.CSSProperties;

          if (event.vimeoId) {
            return (
              <button
                key={event.slug}
                type="button"
                className="brand-card brand-card-film"
                style={style}
                onClick={() => setFilm(event)}
              >
                <div className="brand-card-top" style={{ justifyContent: "flex-end" }}>
                  <b>Watch Film →</b>
                </div>
                <div className="brand-card-content">
                  <h3>{event.brand}</h3>
                </div>
                <span className="brand-card-play" aria-hidden="true">
                  ▶
                </span>
              </button>
            );
          }

          return (
            <Link
              key={event.slug}
              className="brand-card"
              href={`/work/${event.slug}`}
              style={style}
            >
              <div className="brand-card-top" style={{ justifyContent: "flex-end" }}>
                <b>View Event →</b>
              </div>
              <div className="brand-card-content">
                <h3>{event.brand}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {film?.vimeoId && (
        <VideoLightbox
          vimeoId={film.vimeoId}
          title={film.brand}
          onClose={() => setFilm(null)}
        />
      )}
    </>
  );
}
