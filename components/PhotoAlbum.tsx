"use client";

import { useCallback, useEffect, useState } from "react";

export default function PhotoAlbum({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, close, prev, next]);

  return (
    <>
      <div className="album-grid">
        {images.map((image, i) => (
          <button
            key={image}
            type="button"
            className="album-item"
            style={{ "--image": `url('${image}')` } as React.CSSProperties}
            onClick={() => setIndex(i)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close"
            onClick={close}
          >
            ✕
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt=""
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>
          <div className="lightbox-count">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
