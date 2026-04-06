import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { generateActionSuggestions } from "@/lib/ai";
import { getCycleBundleById, saveGeneratedOptions } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteProps) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const bundle = await getCycleBundleById(session.userId, id);

  if (!bundle) {
    return NextResponse.json({ error: "Cycle not found." }, { status: 404 });
  }

  try {
    const options = await generateActionSuggestions({
      theme: bundle.cycle.theme,
      emotion: bundle.cycle.emotion,
      energyLevel: bundle.cycle.energyLevel,
      blocker: bundle.cycle.blocker,
      resistanceReason: bundle.cycle.resistanceReason,
      effortLevel: bundle.cycle.effortLevel,
      desiredOutcome: bundle.cycle.desiredOutcome,
      reflectionText: bundle.cycle.reflectionText,
    });

    const saved = await saveGeneratedOptions(session.userId, id, options);
    revalidatePath(`/cycle/${id}/action`);
    revalidatePath("/dashboard");
    return NextResponse.json({ options: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate actions." },
      { status: 400 },
    );
  }
}
