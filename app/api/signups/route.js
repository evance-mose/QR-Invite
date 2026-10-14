import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { listSignups } from "@/lib/store";

export const runtime = "nodejs";

function passwordMatches(given) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !given) return false;

  const left = Buffer.from(String(given));
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "The list password is not set up yet." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter the list password." }, { status: 400 });
  }

  if (!passwordMatches(body.password)) {
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  try {
    const rows = await listSignups();
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { error: status === 503 ? error.message : "The mailing list could not be loaded." },
      { status }
    );
  }
}
