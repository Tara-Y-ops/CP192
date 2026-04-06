import { notFound, redirect } from "next/navigation";
import { ActionSelection } from "@/components/action-selection";
import { AppShell } from "@/components/app-shell";
import { generateActionSuggestions } from "@/lib/ai";
import {
  getCycleBundleById,
  getProfile,
  saveGeneratedOptions,
} from "@/lib/demo-store";
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

  let initialOptions = bundle.options;

  if (initialOptions.length === 0) {
    try {
      const generated = await generateActionSuggestions({
        theme: bundle.cycle.theme,
        emotion: bundle.cycle.emotion,
        energyLevel: bundle.cycle.energyLevel,
        blocker: bundle.cycle.blocker,
        resistanceReason: bundle.cycle.resistanceReason,
        effortLevel: bundle.cycle.effortLevel,
        desiredOutcome: bundle.cycle.desiredOutcome,
        reflectionText: bundle.cycle.reflectionText,
      });
      initialOptions = await saveGeneratedOptions(session.userId, id, generated);
    } catch {
      initialOptions = [];
    }
  }

  return (
    <AppShell
      title="Choose one action"
      eyebrow="Action Selection"
      sessionLabel={session.displayName}
    >
      <ActionSelection cycle={bundle.cycle} initialOptions={initialOptions} />
    </AppShell>
  );
}
