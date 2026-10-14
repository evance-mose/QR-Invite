import { NextResponse } from "next/server";
import { saveSignup } from "@/lib/store";
import { validateSignup } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter your details and try again." }, { status: 400 });
  }

  const result = validateSignup(body);
  if (result.spam) {
    return NextResponse.json({ ok: true, duplicate: false });
  }
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const saved = await saveSignup(result.value);
    return NextResponse.json({ ok: true, duplicate: Boolean(saved.duplicate) });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { error: status === 503 ? error.message : "The signup could not be saved. Try again." },
      { status }
    );
  }
}
