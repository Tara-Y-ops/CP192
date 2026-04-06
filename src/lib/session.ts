import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextResponse } from "next/server";
import { type SessionUser } from "@/lib/types";

const SESSION_COOKIE = "momentum_session";

function decodeSession(value: string): SessionUser | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as SessionUser;

    if (!parsed.userId || !parsed.email || !parsed.displayName) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function encodeSession(session: SessionUser) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

export async function getOptionalSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  return decodeSession(raw);
}

export async function requireSession() {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/auth");
  }

  return session;
}

export function setSessionCookie(response: NextResponse, session: SessionUser) {
  response.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}
