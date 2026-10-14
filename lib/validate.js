import { institutions } from "./institutions.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const name = plainText(body.name);
  const email = plainText(body.email).toLowerCase();
  const institution = plainText(body.institution);
  const agreement = body.agreement === true;

  if (name.length < 2 || name.length > 120) {
    return { error: "Enter your name." };
  }

  if (!EMAIL.test(email) || email.length > 200) {
    return { error: "Enter a valid email address." };
  }

  if (!institutions.includes(institution)) {
    return { error: "Choose your institution." };
  }

  if (!agreement) {
    return { error: "Tick the box to agree." };
  }

  return {
    ok: true,
    value: {
      submittedAt: new Date().toISOString(),
      name,
      email,
      institution,
    },
  };
}
