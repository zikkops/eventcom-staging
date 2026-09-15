import { ChangePasswordForm } from "@/app/admin/_components/AdminForms";
import { PageTitle } from "@/app/admin/_components/ui";
import { requireAdmin } from "@/server/auth";
import { MIN_PASSWORD_LENGTH } from "@/server/password";

export default async function AccountPage() {
  const me = await requireAdmin();

  return (
    <>
      <PageTitle title="My account" description="Your login details." />

      <dl className="adm-card adm-dl">
        {[
          { label: "Name", value: me.name || "—" },
          { label: "Email", value: me.email },
          { label: "Access", value: me.role === "super" ? "Super admin (manages users)" : "Can edit events" },
        ].map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <section className="adm-card adm-stack" style={{ gap: 16 }}>
        <h2 className="adm-h2">Change your password</h2>
        <ChangePasswordForm minLength={MIN_PASSWORD_LENGTH} />
      </section>
    </>
  );
}
