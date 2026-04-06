import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { saveReview } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";
import { type EmotionalShift } from "@/lib/types";

interface RouteProps {
  params: Promise<{ id: string }>;
}

const SHIFTS: EmotionalShift[] = [
  "worse",
  "about the same",
  "a little better",
  "much better",
];

export async function POST(request: Request, { params }: RouteProps) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        whatHappened?: string;
        emotionalShift?: EmotionalShift;
        engagementScore?: number;
        continueWillingness?: number;
        feelMoreStable?: boolean;
        surprisedBy?: string;
      }
    | null;

  if (
    !body?.whatHappened ||
    !body?.emotionalShift ||
    body.engagementScore === undefined ||
    body.continueWillingness === undefined ||
    typeof body.feelMoreStable !== "boolean" ||
    !body.surprisedBy
  ) {
    return NextResponse.json(
      { error: "Please complete every review field." },
      { status: 400 },
    );
  }

  if (!SHIFTS.includes(body.emotionalShift)) {
    return NextResponse.json({ error: "Invalid emotional shift." }, { status: 400 });
  }

  if (body.engagementScore < 1 || body.engagementScore > 5) {
    return NextResponse.json({ error: "Engagement score must be 1 to 5." }, { status: 400 });
  }

  if (body.continueWillingness < 1 || body.continueWillingness > 5) {
    return NextResponse.json(
      { error: "Continue willingness must be 1 to 5." },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    await saveReview(session.userId, id, {
      whatHappened: body.whatHappened.trim(),
      emotionalShift: body.emotionalShift,
      engagementScore: Number(body.engagementScore),
      continueWillingness: Number(body.continueWillingness),
      feelMoreStable: body.feelMoreStable,
      surprisedBy: body.surprisedBy.trim(),
    });
    revalidatePath("/dashboard");
    revalidatePath("/history");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save review." },
      { status: 400 },
    );
  }
}
