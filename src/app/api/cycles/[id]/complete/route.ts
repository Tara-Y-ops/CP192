import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { completeCycle } from "@/lib/demo-store";
import { getOptionalSession } from "@/lib/session";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const session = await getOptionalSession();

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url), 303);
  }

  const { id } = await params;

  try {
    await completeCycle(session.userId, id);
    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath(`/cycle/${id}/review`);
    return NextResponse.redirect(new URL(`/cycle/${id}/review`, request.url), 303);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete cycle." },
      { status: 400 },
    );
  }
}
