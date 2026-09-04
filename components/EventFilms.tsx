"use client";

import { useState } from "react";
import type { EventFilm } from "@/data/events";
import VideoLightbox from "./VideoLightbox";

export default function EventFilms({ films }: { films: EventFilm[] }) {
  const [active, setActive] = useState<EventFilm | null>(null);
  const playable = films.filter((film) => film.vimeoId);

  if (playable.length === 0) return null;

  return (
    <>
      <div className="film-grid">
        {playable.map((film) => (
          <button
            key={film.vimeoId}
            type="button"
            className="film-card"
            style={{ "--image": `url('${film.poster}')` } as React.CSSProperties}
            onClick={() => setActive(film)}
          >
            <span className="film-card-play" aria-hidden="true">
              ▶
            </span>
            <span className="film-card-title">{film.title}</span>
          </button>
        ))}
      </div>

      {active && (
        <VideoLightbox
          vimeoId={active.vimeoId}
          title={active.title}
          vertical={active.vertical}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
