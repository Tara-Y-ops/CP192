import { NextResponse } from "next/server";
import { getProfile } from "@/lib/demo-store";
import { setSessionCookie } from "@/lib/session";
import { type SessionUser } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; displayName?: string }
    | null;

  const email = body?.email?.trim().toLowerCase();
  const displayName = body?.displayName?.trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (!displayName) {
    return NextResponse.json({ error: "Please enter a display name." }, { status: 400 });
  }

  const session: SessionUser = {
    userId: email,
    email,
    displayName,
  };

  const profile = await getProfile(session.userId);
  const response = NextResponse.json({
    next: profile?.focusArea ? "/dashboard" : "/onboarding",
  });
  setSessionCookie(response, session);
  return response;
}
