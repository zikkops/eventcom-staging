"use client";

import { useState } from "react";
import { sizedImage } from "@/lib/imageUrl";
import { DragHandle } from "./DragHandle";
import { labelClass, secondaryButtonClass } from "./ui";
import { uploadImage } from "./uploadImage";

export function GalleryField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function add(files: File[]) {
    setError("");
    const added: string[] = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Uploading ${index + 1} of ${files.length}…`);
      try {
        added.push(await uploadImage(file));
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : `Upload of ${file.name} failed.`);
        break;
      }
    }
    setProgress(null);
    onChange([...value, ...added]);
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const canReorder = value.length > 1 && progress === null;

  return (
    <div className="adm-stack-sm">
      <span className={labelClass}>{label}</span>
      {hint && <p className="adm-hint">{hint}</p>}

      {value.length > 0 && (
        <ul onDragOver={(event) => event.preventDefault()} className="adm-gallery">
          {value.map((src, index) => (
            <li
              key={src}
              draggable={canReorder}
              onDragStart={() => setDragIndex(index)}
              onDragEnter={() => {
                if (dragIndex === null || dragIndex === index) return;
                move(dragIndex, index);
                setDragIndex(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={dragIndex === index ? "adm-dragging" : undefined}
              style={canReorder ? { cursor: "grab" } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sizedImage(src, 400)} alt={`Photo ${index + 1}`} draggable={false} />

              {canReorder && <DragHandle onHold={() => {}} className="adm-gallery-grip" />}
              <span className="adm-gallery-num">{index + 1}</span>

              <div className="adm-gallery-tools">
                <span className="adm-row-tight">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    className="adm-icon-btn"
                    disabled={index === 0 || progress !== null}
                    onClick={() => move(index, index - 1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    className="adm-icon-btn"
                    disabled={index === value.length - 1 || progress !== null}
                    onClick={() => move(index, index + 1)}
                  >
                    →
                  </button>
                </span>
                <button
                  type="button"
                  aria-label="Remove photo"
                  className="adm-icon-btn adm-icon-btn-danger"
                  disabled={progress !== null}
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className={`${secondaryButtonClass} adm-upload`}>
        {progress ?? "+ Add photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="adm-sr-only"
          disabled={progress !== null}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length > 0) void add(files);
          }}
        />
      </label>
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
    </div>
  );
}
