import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { saveProfile } from "@/lib/demo-store";
import { getOptionalSession, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { displayName?: string; focusArea?: string }
    | null;

  const displayName = body?.displayName?.trim();
  const focusArea = body?.focusArea?.trim();

  if (!displayName || !focusArea) {
    return NextResponse.json(
      { error: "Display name and focus area are required." },
      { status: 400 },
    );
  }

  await saveProfile(session, { displayName, focusArea });
  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/cycle/new");

  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, { ...session, displayName });
  return response;
}
