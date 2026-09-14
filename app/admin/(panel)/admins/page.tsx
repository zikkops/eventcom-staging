import { redirect } from "next/navigation";
import { deleteAdmin } from "@/app/admin/actions";
import { CreateAdminForm, ResetPasswordForm } from "@/app/admin/_components/AdminForms";
import { ConfirmSubmit } from "@/app/admin/_components/ConfirmSubmit";
import { dangerButtonClass, PageTitle } from "@/app/admin/_components/ui";
import { listAdmins, requireAdmin } from "@/server/auth";
import { MIN_PASSWORD_LENGTH } from "@/server/password";

export default async function AdminsPage() {
  const me = await requireAdmin();
  if (me.role !== "super") redirect("/admin/events");
  const admins = await listAdmins();

  return (
    <>
      <PageTitle
        title="Users"
        description="Who can log in to this panel. Only you can add or remove people and reset their passwords."
      />

      <ul className="adm-list" style={{ marginBottom: 40 }}>
        {admins.map((admin) => (
          <li key={admin.id}>
            <div className="adm-list-body">
              <p className="adm-strong">
                {admin.name || admin.email}
                {admin.role === "super" && <span className="adm-badge">Main admin</span>}
              </p>
              <p className="adm-hint">
                {admin.email} · added {new Date(admin.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            {admin.role === "super" ? (
              <span className="adm-hint">{admin.id === me.id ? "You · can't be removed" : "Can't be removed"}</span>
            ) : (
              <div className="adm-row" style={{ alignItems: "flex-start", gap: 8 }}>
                <ResetPasswordForm id={admin.id} email={admin.email} />
                <form action={deleteAdmin}>
                  <input type="hidden" name="id" value={admin.id} />
                  <ConfirmSubmit
                    className={dangerButtonClass}
                    message={`Remove ${admin.email}? They'll be logged out straight away.`}
                  >
                    Remove
                  </ConfirmSubmit>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>

      <section className="adm-card adm-stack" style={{ gap: 16 }}>
        <div>
          <h2 className="adm-h2">Add a user</h2>
          <p className="adm-hint" style={{ marginTop: 4 }}>
            They can edit events, but never see this page. Change your own password under My account.
          </p>
        </div>
        <CreateAdminForm minLength={MIN_PASSWORD_LENGTH} />
      </section>
    </>
  );
}
