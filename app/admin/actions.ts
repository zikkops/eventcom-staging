"use server";

import { randomBytes } from "node:crypto";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  attemptLogin,
  endAllSessions,
  endOtherSessions,
  endSession,
  requireAdmin,
  requireSuperAdmin,
} from "@/server/auth";
import { CONTENT_TAG, isSeeded, readEvent, readEvents } from "@/server/content";
import { db, insertEvent, updateEvent } from "@/server/db";
import { imageUrlsIn, normalizeEvent, slugify } from "@/server/eventData";
import { deleteImages } from "@/server/imagekit";
import { uploadSignature } from "@/server/imagekitAuth";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/server/password";
import type { FormResult } from "./_components/types";

// Every action checks the login itself: an action is reachable by a direct
// POST, whatever page it's used on.

function parseJson(value: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(value ?? ""));
  } catch {
    return null;
  }
}

const field = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Deletes the photos `previous` used that no event uses any more. */
async function deleteOrphanedImages(previous: unknown) {
  try {
    const inUse = imageUrlsIn(await readEvents());
    await deleteImages([...imageUrlsIn(previous)].filter((url) => !inUse.has(url)));
  } catch (error) {
    console.error("Couldn't clean up unused photos:", error);
  }
}

// ── Login ────────────────────────────────────────────────────────────────

export async function login(_: FormResult, formData: FormData): Promise<FormResult> {
  const result = await attemptLogin(field(formData, "email"), String(formData.get("password") ?? ""));
  if (result === "locked") {
    return { ok: false, message: "Too many failed attempts. Try again in 15 minutes." };
  }
  if (result === "invalid") return { ok: false, message: "Wrong email or password." };
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ── Photos ───────────────────────────────────────────────────────────────

export async function getUploadSignature() {
  await requireAdmin();
  return uploadSignature();
}

// ── Events ───────────────────────────────────────────────────────────────

async function nextPosition() {
  const [row] = await db()`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM events`;
  return Number(row.next);
}

const isUniqueViolation = (error: unknown) => (error as { code?: string }).code === "23505";

export async function saveEvent(_: FormResult, formData: FormData): Promise<FormResult> {
  await requireAdmin();
  if (!(await isSeeded())) {
    return { ok: false, message: "Run npm run db:setup before adding events." };
  }

  const id = Number(formData.get("id")) || null;
  const opensFilm = formData.get("kind") === "film";
  const event = normalizeEvent(parseJson(formData.get("data")));

  if (!event.brand) return { ok: false, message: "Give the event a brand name." };
  event.slug ||= slugify(event.brand);
  if (!event.slug) return { ok: false, message: "The web address needs at least one letter or number." };

  if (opensFilm) {
    if (!event.vimeoId) return { ok: false, message: "Paste the Vimeo link of the film the card should play." };
  } else {
    // Only a lightbox event carries a card film; an event page shows its films on the page.
    event.vimeoId = "";
    const missing = event.films.findIndex((film) => !film.vimeoId);
    if (missing >= 0) {
      return { ok: false, message: `Film ${missing + 1} needs a Vimeo link, or remove it.` };
    }
  }

  const previous = id ? await readEvent(id) : null;
  if (id && !previous) return { ok: false, message: "This event was deleted in the meantime." };

  const taken = `Another event already uses the address /work/${event.slug}.`;
  const [clash] = await db()`SELECT id FROM events WHERE slug = ${event.slug} AND id <> ${id ?? 0}`;
  if (clash) return { ok: false, message: taken };

  try {
    if (previous) await updateEvent(db(), previous.id, event);
    else await insertEvent(db(), event, await nextPosition());
  } catch (error) {
    // Someone else took the address between the check and the save.
    if (isUniqueViolation(error)) return { ok: false, message: taken };
    throw error;
  }
  if (previous) await deleteOrphanedImages(previous);

  updateTag(CONTENT_TAG);
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin();
  const event = await readEvent(Number(formData.get("id")));
  if (!event) return;

  await db()`DELETE FROM events WHERE id = ${event.id}`;
  await deleteOrphanedImages(event);
  updateTag(CONTENT_TAG);
  refresh();
}

/** Stores the whole running order after the events were dragged around. */
export async function reorderEvents(formData: FormData) {
  await requireAdmin();
  const ids = String(formData.get("order") ?? "")
    .split(",")
    .map(Number)
    .filter(Number.isInteger);

  const known = new Set((await readEvents()).map((event) => event.id));
  // Ignore a list that no longer matches, e.g. after someone else added or removed an event.
  if (ids.length !== known.size || new Set(ids).size !== ids.length || !ids.every((id) => known.has(id))) {
    return;
  }

  const sql = db();
  await sql.transaction(
    ids.map((id, position) => sql`UPDATE events SET position = ${position} WHERE id = ${id}`),
  );
  updateTag(CONTENT_TAG);
  refresh();
}

// ── Accounts ─────────────────────────────────────────────────────────────
// Only the main (super) admin manages other people. Nothing here can change
// anyone's access level, so the main admin can't be demoted or removed.

const newPassword = () => randomBytes(12).toString("base64url");

export async function createAdmin(_: FormResult, formData: FormData): Promise<FormResult> {
  await requireSuperAdmin();
  const email = field(formData, "email").toLowerCase();
  const name = field(formData, "name");
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: `The password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const rows = await db()`INSERT INTO admins (email, name, password_hash, role)
    VALUES (${email}, ${name}, ${await hashPassword(password)}, 'admin')
    ON CONFLICT (email) DO NOTHING RETURNING id`;
  if (rows.length === 0) return { ok: false, message: "There's already a user with that email." };

  refresh();
  return { ok: true, message: `${email} can now log in.` };
}

/** Gives one user a new password and shows it once, for the main admin to pass on. */
export async function resetPassword(_: FormResult, formData: FormData): Promise<FormResult> {
  await requireSuperAdmin();
  const id = Number(formData.get("id"));
  const [target] = await db()`SELECT id, email, role FROM admins WHERE id = ${id}`;
  if (!target) return { ok: false, message: "That user no longer exists." };
  if (target.role === "super") {
    return { ok: false, message: "A super admin changes their own password under My account." };
  }

  const password = newPassword();
  await db()`UPDATE admins SET password_hash = ${await hashPassword(password)} WHERE id = ${target.id}`;
  await endAllSessions(Number(target.id));

  refresh();
  return { ok: true, message: `New password for ${target.email}: ${password}` };
}

export async function deleteAdmin(formData: FormData) {
  const me = await requireSuperAdmin();
  const id = Number(formData.get("id"));
  if (!id || id === me.id) return;
  // The main admin can never be removed, and the last account always stays.
  await db()`DELETE FROM admins
    WHERE id = ${id} AND role <> 'super' AND (SELECT count(*) FROM admins) > 1`;
  refresh();
}

/** Anyone can change their own password; nobody else's. */
export async function changePassword(_: FormResult, formData: FormData): Promise<FormResult> {
  const me = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");

  const [row] = await db()`SELECT password_hash FROM admins WHERE id = ${me.id}`;
  if (!row || !(await verifyPassword(current, row.password_hash))) {
    return { ok: false, message: "Your current password is wrong." };
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, message: `The new password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  await db()`UPDATE admins SET password_hash = ${await hashPassword(next)} WHERE id = ${me.id}`;
  await endOtherSessions(me.id);
  return { ok: true, message: "Password changed. Any other devices have been logged out." };
}
