import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { selectAction } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        kind?: "existing" | "custom";
        actionOptionId?: string;
        title?: string;
        description?: string;
        estimatedMinutes?: number;
        rationale?: string;
      }
    | null;

  const { id } = await params;

  if (!body?.kind) {
    return NextResponse.json({ error: "Missing action payload." }, { status: 400 });
  }

  try {
    if (body.kind === "existing") {
      if (!body.actionOptionId) {
        return NextResponse.json({ error: "Missing action option id." }, { status: 400 });
      }

      await selectAction(session.userId, id, {
        kind: "existing",
        actionOptionId: body.actionOptionId,
      });
    } else {
      if (!body.title || !body.description || !body.rationale || !body.estimatedMinutes) {
        return NextResponse.json(
          { error: "Please complete every custom action field." },
          { status: 400 },
        );
      }

      await selectAction(session.userId, id, {
        kind: "custom",
        title: body.title.trim(),
        description: body.description.trim(),
        estimatedMinutes: Number(body.estimatedMinutes),
        rationale: body.rationale.trim(),
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath(`/cycle/${id}/action`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to select action." },
      { status: 400 },
    );
  }
}
