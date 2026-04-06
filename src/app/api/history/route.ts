import { NextResponse } from "next/server";
import { getHistory } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

export async function GET() {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const history = await getHistory(session.userId);
  return NextResponse.json({ history });
}
