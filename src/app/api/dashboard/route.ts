import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

export async function GET() {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const summary = await getDashboardSummary(session.userId);
  return NextResponse.json(summary);
}
