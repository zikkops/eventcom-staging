import type { FormResult } from "./types";

export const labelClass = "adm-label";
export const inputClass = "adm-input";
export const buttonClass = "adm-btn";
export const secondaryButtonClass = "adm-btn adm-btn-secondary";
export const dangerButtonClass = "adm-btn adm-btn-danger";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="adm-field">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="adm-title-row">
      <div>
        <h1 className="adm-h1">{title}</h1>
        {description && <p className="adm-lead">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="adm-card adm-stack">
      <div>
        <h2 className="adm-h2">{title}</h2>
        {hint && (
          <p className="adm-hint" style={{ marginTop: 4 }}>
            {hint}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

/** A form action's result message, in green or red. */
export function Status({ result }: { result: FormResult }) {
  if (!result) return null;
  return (
    <p role="status" className={result.ok ? "adm-ok" : "adm-error"}>
      {result.message}
    </p>
  );
}

/** Sticky save button with the action's result beside it. */
export function SaveBar({ pending, result, label }: { pending: boolean; result: FormResult; label: string }) {
  return (
    <div className="adm-savebar">
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : label}
      </button>
      <Status result={result} />
    </div>
  );
}
