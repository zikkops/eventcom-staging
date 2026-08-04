"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <Link className="brand" href="/">
        Eventcom
      </Link>
      <nav className="nav-links">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              className={isActive ? "active" : ""}
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link className="btn" href="/contact">
        Let&rsquo;s Talk
      </Link>
    </header>
  );
}
