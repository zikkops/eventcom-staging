"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { buttonClass, Field, inputClass } from "../_components/ui";

export function LoginForm() {
  const [result, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="adm-stack" style={{ marginTop: 24, gap: 16 }}>
      <Field label="Email">
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </Field>
      {result && !result.ok && (
        <p role="alert" className="adm-error">
          {result.message}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
