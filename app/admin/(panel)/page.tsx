import Link from "next/link";
import { redirect } from "next/navigation";
import { PageTitle } from "@/app/admin/_components/ui";
import { listAdmins, requireAdmin } from "@/server/auth";
import { isSeeded, readEvents } from "@/server/content";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  // Everyone except the main admin works straight in Events.
  if (admin.role !== "super") redirect("/admin/events");

  const [seeded, events, admins] = await Promise.all([isSeeded(), readEvents(), listAdmins()]);
  const films = events.filter((event) => event.vimeoId).length;

  const cards = [
    {
      href: "/admin/events",
      title: "Events",
      body: `${events.length} on the Work page, ${films} of them film lightboxes. Add, edit, reorder or remove them.`,
    },
    {
      href: "/admin/admins",
      title: "Users",
      body: `${admins.length} can log in. Add people, remove them, or reset a password.`,
    },
    { href: "/admin/account", title: "My account", body: "Change your own password." },
  ];

  return (
    <>
      <PageTitle
        title={`Hello${admin.name ? `, ${admin.name}` : ""}`}
        description="Anything you save here goes live on the website straight away."
      />
      {!seeded && (
        <p className="adm-notice">
          The database has no content yet. Run <code>npm run db:setup</code> to copy the current
          website into it.
        </p>
      )}
      <ul className="adm-dash-grid">
        {cards.map((card) => (
          <li key={card.href}>
            <Link href={card.href} className="adm-dash-card">
              <span className="adm-h2">{card.title}</span>
              <span className="adm-hint" style={{ fontSize: 14 }}>
                {card.body}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
