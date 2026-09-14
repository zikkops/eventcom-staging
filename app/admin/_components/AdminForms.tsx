"use client";

import { useActionState } from "react";
import { changePassword, createAdmin, resetPassword } from "../actions";
import { ConfirmSubmit } from "./ConfirmSubmit";
import { buttonClass, Field, inputClass, secondaryButtonClass, Status } from "./ui";

export function CreateAdminForm({ minLength }: { minLength: number }) {
  const [result, action, pending] = useActionState(createAdmin, null);
  return (
    <form action={action} className="adm-grid-2">
      <Field label="Name">
        <input name="name" autoComplete="off" className={inputClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="off" className={inputClass} />
      </Field>
      <Field
        label="Password"
        hint={`At least ${minLength} characters. Give it to them privately; they can change it after logging in.`}
      >
        <input
          name="password"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <div className="adm-row" style={{ gridColumn: "1 / -1" }}>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Adding…" : "Add user"}
        </button>
        <Status result={result} />
      </div>
    </form>
  );
}

/** Gives one user a new password, shown once so it can be passed on. */
export function ResetPasswordForm({ id, email }: { id: number; email: string }) {
  const [result, action, pending] = useActionState(resetPassword, null);
  return (
    <form action={action} className="adm-stack-sm" style={{ alignItems: "flex-end", gap: 4 }}>
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmit
        className={secondaryButtonClass}
        message={`Give ${email} a new password? They'll be logged out everywhere and will need the new one.`}
      >
        {pending ? "Resetting…" : "Reset password"}
      </ConfirmSubmit>
      <Status result={result} />
    </form>
  );
}

export function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [result, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="adm-grid-2">
      <Field label="Current password">
        <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </Field>
      <Field label="New password" hint={`At least ${minLength} characters.`}>
        <input
          name="next"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <div className="adm-row" style={{ gridColumn: "1 / -1" }}>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving…" : "Change password"}
        </button>
        <Status result={result} />
      </div>
    </form>
  );
}
