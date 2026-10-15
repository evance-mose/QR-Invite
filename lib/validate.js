import { provinces } from "./provinces.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function surnameStartsWithCapital(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const surname = parts[parts.length - 1] || "";
  const first = Array.from(surname)[0] || "";
  return first !== first.toLocaleLowerCase() && first === first.toLocaleUpperCase();
}

function plainText(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (/^[=+\-@]/.test(text)) return `'${text}`;
  return text;
}

export function validateSignup(body) {
  if (!body || typeof body !== "object") {
    return { error: "Enter your details and try again." };
  }

  if (String(body.company_website || "").trim()) {
    return { ok: true, spam: true };
  }

  const title = plainText(body.title);
  const name = plainText(body.name);
  const email = plainText(body.email).toLowerCase();
  const institution = plainText(body.institution);
  const province = plainText(body.province);
  const agreement = body.agreement === true;

  if (title.length < 2 || title.length > 40) {
    return { error: "Enter your title." };
  }

  if (name.length < 2 || name.length > 120) {
    return { error: "Enter your name and surname." };
  }

  if (!surnameStartsWithCapital(name)) {
    return { error: "Surname must start with a capital letter." };
  }

  if (!EMAIL.test(email) || email.length > 200) {
    return { error: "Enter a valid email address." };
  }

  if (institution.length < 2 || institution.length > 160) {
    return { error: "Enter your institution." };
  }

  if (!provinces.includes(province)) {
    return { error: "Choose your province." };
  }

  if (!agreement) {
    return { error: "Tick the box to agree." };
  }

  return {
    ok: true,
    value: {
      submittedAt: new Date().toISOString(),
      title,
      name,
      email,
      institution,
      province,
    },
  };
}
