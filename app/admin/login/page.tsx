import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/server/auth";
import { isDatabaseConfigured } from "@/server/env";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="adm-login">
      <div className="adm-login-card">
        <p className="adm-eyebrow">Eventcom</p>
        <h1 className="adm-h1" style={{ marginTop: 6 }}>
          Admin login
        </h1>
        {isDatabaseConfigured ? (
          <LoginForm />
        ) : (
          <p style={{ marginTop: 20, fontSize: 14 }}>
            The database isn&apos;t connected yet. Set DATABASE_URL (in .env.local, or in the
            hosting provider&apos;s environment variables), run <code>npm run db:setup</code>, and
            restart the site.
          </p>
        )}
      </div>
    </main>
  );
}
