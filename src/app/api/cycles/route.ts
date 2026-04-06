import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createCycle } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";
import {
  type CreateCycleInput,
  type EffortLevel,
  type EnergyLevel,
  type ThemeOption,
} from "@/lib/types";

const EFFORT_LEVELS: EffortLevel[] = [
  "2 minutes",
  "5 minutes",
  "10 minutes",
  "only prepare",
  "only make a draft",
  "only break it down",
];

const ENERGY_LEVELS: EnergyLevel[] = ["low", "medium", "high"];

const THEMES: ThemeOption[] = ["interest", "career", "relationships", "habits", "values"];

export async function POST(request: Request) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<CreateCycleInput> | null;

  if (
    !body ||
    !body.theme ||
    !body.emotion ||
    !body.energyLevel ||
    !body.blocker ||
    !body.resistanceReason ||
    !body.effortLevel ||
    !body.desiredOutcome ||
    !body.reflectionText
  ) {
    return NextResponse.json(
      { error: "Please complete every reflection field." },
      { status: 400 },
    );
  }

  if (!THEMES.includes(body.theme)) {
    return NextResponse.json({ error: "Invalid theme." }, { status: 400 });
  }

  if (!EFFORT_LEVELS.includes(body.effortLevel)) {
    return NextResponse.json({ error: "Invalid effort level." }, { status: 400 });
  }

  if (!ENERGY_LEVELS.includes(body.energyLevel)) {
    return NextResponse.json({ error: "Invalid energy level." }, { status: 400 });
  }

  try {
    const cycle = await createCycle(session.userId, body as CreateCycleInput);
    revalidatePath("/dashboard");
    revalidatePath("/history");
    return NextResponse.json({ id: cycle.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create cycle." },
      { status: 409 },
    );
  }
}
