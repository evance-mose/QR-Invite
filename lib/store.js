import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "signups.json");

export function sheetConfigured() {
  return Boolean(process.env.GOOGLE_SCRIPT_URL && process.env.SIGNUP_SECRET);
}

async function readLocalSignups() {
  try {
    const text = await readFile(filePath, "utf8");
    const rows = JSON.parse(text);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function writeLocalSignups(rows) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(rows, null, 2));
}

async function postToAppsScript(url, payload) {
  const body = JSON.stringify(payload);
  const init = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual",
  };

  let response = await fetch(url, init);

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) {
      throw new Error("The Google Sheet link did not respond.");
    }
    response = await fetch(location, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  }

  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "The signup could not be saved.");
  }

  return data;
}

export async function saveSignup(entry) {
  if (sheetConfigured()) {
    return postToAppsScript(process.env.GOOGLE_SCRIPT_URL, {
      action: "add",
      secret: process.env.SIGNUP_SECRET,
      ...entry,
    });
  }

  if (process.env.NODE_ENV === "production") {
    const error = new Error("Mailing list storage is not set up yet.");
    error.status = 503;
    throw error;
  }

  const rows = await readLocalSignups();
  if (rows.some((row) => row.email === entry.email)) {
    return { ok: true, duplicate: true };
  }

  rows.push(entry);
  await writeLocalSignups(rows);
  return { ok: true, duplicate: false };
}

export async function listSignups() {
  if (sheetConfigured()) {
    const url = new URL(process.env.GOOGLE_SCRIPT_URL);
    url.searchParams.set("secret", process.env.SIGNUP_SECRET);
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || data.ok === false) {
      throw new Error(data.error || "The mailing list could not be loaded.");
    }
    return Array.isArray(data.rows) ? data.rows : [];
  }

  if (process.env.NODE_ENV === "production") {
    const error = new Error("Mailing list storage is not set up yet.");
    error.status = 503;
    throw error;
  }

  const rows = await readLocalSignups();
  return rows.slice().reverse();
}
