import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/server/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  // Only the main admin sees the dashboard and the user list; everyone else
  // works straight in Events.
  const nav =
    admin.role === "super"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/events", label: "Events" },
          { href: "/admin/admins", label: "Users" },
          { href: "/admin/account", label: "My account" },
        ]
      : [
          { href: "/admin/events", label: "Events" },
          { href: "/admin/account", label: "My account" },
        ];

  return (
    <>
      <header className="adm-header">
        <div className="adm-header-inner">
          <Link href="/admin/events" className="adm-brand">
            EVENTCOM
          </Link>
          <nav aria-label="Admin">
            <ul className="adm-nav">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="adm-header-meta">
            <Link href="/" target="_blank" className="adm-view">
              View site ↗
            </Link>
            <span className="adm-who">{admin.name || admin.email}</span>
            <form action={logout}>
              <button type="submit" className="adm-link-button">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
