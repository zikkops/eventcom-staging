"use client";

import { useState } from "react";
import { sizedImage } from "@/lib/imageUrl";
import { dangerButtonClass, labelClass, secondaryButtonClass } from "./ui";
import { uploadImage } from "./uploadImage";

export function ImageField({
  label,
  hint,
  value,
  onChange,
  removable,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  removable?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="adm-field">
      <span className={labelClass}>{label}</span>
      <div className="adm-row">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sizedImage(value, 320)} alt="" className="adm-thumb" />
        ) : (
          <div className="adm-thumb adm-thumb-empty">No photo</div>
        )}
        <label className={`${secondaryButtonClass} adm-upload`}>
          {uploading ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
          <input
            type="file"
            accept="image/*"
            className="adm-sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void upload(file);
            }}
          />
        </label>
        {removable && value && !uploading && (
          <button type="button" className={dangerButtonClass} onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
      {hint && <span className="adm-hint">{hint}</span>}
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
    </div>
  );
}
