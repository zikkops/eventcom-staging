"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const close = useCallback(() => setOpen(false), []);

  // Close on navigation, so a back/forward move never leaves the panel up.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Close if the viewport grows past the breakpoint while the panel is up.
    const wide = window.matchMedia("(min-width: 1101px)");
    const onChange = () => wide.matches && close();

    window.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onChange);
    };
  }, [open, close]);

  return (
    <header className="nav">
      <Link className="brand" href="/">
        <Image
          src="/eventcom-logo.png"
          alt="Eventcom"
          width={196}
          height={40}
          priority
        />
      </Link>

      <nav className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            className={isActive(link.href) ? "active" : ""}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="btn nav-cta" href="/contact">
        Let&rsquo;s Talk
      </Link>

      <button
        type="button"
        className={`nav-toggle${open ? " is-open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="mobile-menu"
        className={`mobile-menu${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <nav className="mobile-menu-links">
          {links.map((link) => (
            <Link
              key={link.href}
              className={isActive(link.href) ? "active" : ""}
              href={link.href}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-pink" href="/contact" onClick={close}>
          Let&rsquo;s Talk →
        </Link>
      </div>
    </header>
  );
}
