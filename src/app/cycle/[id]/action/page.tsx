import { notFound, redirect } from "next/navigation";
import { ActionSelection } from "@/components/action-selection";
import { AppShell } from "@/components/app-shell";
import { getCycleBundleById, getProfile } from "@/lib/demo-store";
import { requireSession } from "@/lib/session";

interface ActionPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActionPage({ params }: ActionPageProps) {
  const session = await requireSession();
  const profile = await getProfile(session.userId);

  if (!profile?.focusArea) {
    redirect("/onboarding");
  }

  const { id } = await params;
  const bundle = await getCycleBundleById(session.userId, id);

  if (!bundle) {
    notFound();
  }

  if (bundle.cycle.status !== "reflecting") {
    redirect("/dashboard");
  }

  return (
    <AppShell
      title="Choose one action"
      sessionLabel={session.displayName}
    >
      <ActionSelection cycle={bundle.cycle} initialOptions={bundle.options} />
    </AppShell>
  );
}
