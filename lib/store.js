function sheetConfigured() {
  return Boolean(process.env.GOOGLE_SCRIPT_URL && process.env.SIGNUP_SECRET);
}

function scriptPayload(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end < start) return null;
  try {
    const data = JSON.parse(text.slice(start, end + 1));
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

async function postToAppsScript(url, payload) {
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual",
    cache: "no-store",
  });

  // Google saves the row, then redirects. The result is a GET on that next address.
  for (let hop = 0; hop < 5 && response.status >= 300 && response.status < 400; hop += 1) {
    const location = response.headers.get("location");
    if (!location) return { ok: true, duplicate: false };
    response = await fetch(new URL(location, url), {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
    });
  }

  const data = scriptPayload(await response.text());
  if (data?.ok === true) return data;
  if (data?.ok === false) {
    throw new Error(data.error || "The signup could not be saved.");
  }
  if (response.ok || (response.status >= 300 && response.status < 400)) {
    return { ok: true, duplicate: false };
  }

  throw new Error("The signup could not be saved.");
}

export async function saveSignup(entry) {
  if (!sheetConfigured()) {
    const error = new Error("Mailing list storage is not set up yet.");
    error.status = 503;
    throw error;
  }

  return postToAppsScript(process.env.GOOGLE_SCRIPT_URL, {
    action: "add",
    secret: process.env.SIGNUP_SECRET,
    ...entry,
  });
}
