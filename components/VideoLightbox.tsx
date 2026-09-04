"use client";

import { useEffect } from "react";

export default function VideoLightbox({
  vimeoId,
  title,
  vertical = false,
  onClose,
}: {
  vimeoId: string;
  title: string;
  vertical?: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className={`lightbox-video${vertical ? " lightbox-video-vertical" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
        />
      </div>
      <div className="lightbox-count">{title}</div>
    </div>
  );
}
