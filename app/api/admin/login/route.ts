import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const rl = rateLimit(`admin-login:${clientKey(req)}`, 5, 5 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const { email, password } = parsed.data;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_HASH  = process.env.ADMIN_PASSWORD_HASH;

  if (!ADMIN_EMAIL || !ADMIN_HASH) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const emailOk = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const passOk  = await bcrypt.compare(password, ADMIN_HASH);
  // constant-ish timing
  if (!emailOk || !passOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSession({ sub: "admin", email: ADMIN_EMAIL, role: "ADMIN" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    // Browsers drop Secure cookies on http://localhost, which would make the
    // dashboard unreachable in local development.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
