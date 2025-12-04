import { NextRequest, NextResponse } from "next/server";

// Common cookie names used by NextAuth and typical custom tokens
const COOKIE_NAMES_TO_CLEAR = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
  "token",
  "session",
  "user",
];

function buildLogoutResponse() {
  const res = NextResponse.json({ ok: true, message: "Logged out" }, { status: 200 });
  for (const name of COOKIE_NAMES_TO_CLEAR) {
    try {
      res.cookies.delete(name);
    } catch {
      // ignore
    }
  }
  return res;
}

export async function POST(_req: NextRequest) {
  return buildLogoutResponse();
}

export async function GET(_req: NextRequest) {
  // Allow GET for convenience (e.g., using a simple link)
  return buildLogoutResponse();
}
