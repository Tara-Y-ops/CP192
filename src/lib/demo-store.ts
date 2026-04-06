import { promises as fs } from "node:fs";
import path from "node:path";
import {
  type ActionOption,
  type CreateCycleInput,
  type Cycle,
  type CycleBundle,
  type DashboardSummary,
  type DemoDb,
  type DraftActionOption,
  type Profile,
  type Review,
  type ReviewInput,
  type SessionUser,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "momentum-demo.json");

const EMPTY_DB: DemoDb = {
  profiles: [],
  cycles: [],
  actionOptions: [],
  reviews: [],
};

async function ensureDbFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(EMPTY_DB, null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDbFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as DemoDb;
}

async function writeDb(db: DemoDb) {
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

function bundleCycle(db: DemoDb, cycle: Cycle): CycleBundle {
  const options = db.actionOptions.filter((option) => option.cycleId === cycle.id);
  const review = db.reviews.find((item) => item.cycleId === cycle.id) ?? null;
  const selectedAction =
    options.find((option) => option.id === cycle.selectedActionOptionId) ?? null;

  return { cycle, options, selectedAction, review };
}

function getNextStep(activeCycle: CycleBundle | null): DashboardSummary["nextStep"] {
  if (!activeCycle) {
    return {
      label: "Start a reflection",
      href: "/cycle/new",
      description: "Create one new cycle and see what action feels possible now.",
    };
  }

  if (activeCycle.cycle.status === "reflecting") {
    return {
      label: "Choose your action",
      href: `/cycle/${activeCycle.cycle.id}/action`,
      description: "Pick an AI suggestion or write one of your own.",
    };
  }

  if (activeCycle.cycle.status === "pending") {
    return {
      label: "Action in progress",
      href: "/dashboard",
      description: "Finish the selected action, then mark it complete to move into review.",
    };
  }

  return {
    label: "Complete your review",
    href: `/cycle/${activeCycle.cycle.id}/review`,
    description: "Capture what changed so the cycle becomes useful next time.",
  };
}

export async function getProfile(userId: string) {
  const db = await readDb();
  return db.profiles.find((profile) => profile.userId === userId) ?? null;
}

export async function saveProfile(
  session: SessionUser,
  input: { displayName: string; focusArea: string },
) {
  const db = await readDb();
  const now = new Date().toISOString();
  const existingIndex = db.profiles.findIndex((profile) => profile.userId === session.userId);

  const profile: Profile = {
    userId: session.userId,
    email: session.email,
    displayName: input.displayName || session.displayName,
    focusArea: input.focusArea,
    createdAt: existingIndex >= 0 ? db.profiles[existingIndex].createdAt : now,
  };

  if (existingIndex >= 0) {
    db.profiles[existingIndex] = profile;
  } else {
    db.profiles.push(profile);
  }

  await writeDb(db);
  return profile;
}

export async function getActiveCycleBundle(userId: string) {
  const db = await readDb();
  const cycle =
    [...db.cycles]
      .filter((item) => item.userId === userId && item.status !== "reviewed")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;

  return cycle ? bundleCycle(db, cycle) : null;
}

export async function createCycle(userId: string, input: CreateCycleInput) {
  const db = await readDb();
  const activeCycle = db.cycles.find(
    (cycle) => cycle.userId === userId && cycle.status !== "reviewed",
  );

  if (activeCycle) {
    throw new Error("You already have an active cycle.");
  }

  const now = new Date().toISOString();
  const cycle: Cycle = {
    id: crypto.randomUUID(),
    userId,
    theme: input.theme,
    emotion: input.emotion,
    energyLevel: input.energyLevel,
    blocker: input.blocker,
    resistanceReason: input.resistanceReason,
    effortLevel: input.effortLevel,
    desiredOutcome: input.desiredOutcome,
    reflectionText: input.reflectionText,
    status: "reflecting",
    selectedActionOptionId: null,
    createdAt: now,
    updatedAt: now,
  };

  db.cycles.push(cycle);
  await writeDb(db);
  return cycle;
}

export async function getCycleBundleById(userId: string, cycleId: string) {
  const db = await readDb();
  const cycle = db.cycles.find((item) => item.id === cycleId && item.userId === userId);

  if (!cycle) {
    return null;
  }

  return bundleCycle(db, cycle);
}

export async function saveGeneratedOptions(
  userId: string,
  cycleId: string,
  drafts: DraftActionOption[],
) {
  const db = await readDb();
  const cycle = db.cycles.find((item) => item.id === cycleId && item.userId === userId);

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  if (cycle.status !== "reflecting") {
    throw new Error("Action options can only be generated during reflection.");
  }

  db.actionOptions = db.actionOptions.filter(
    (option) => !(option.cycleId === cycleId && option.source === "ai"),
  );

  const now = new Date().toISOString();
  const saved: ActionOption[] = drafts.map((draft) => ({
    id: crypto.randomUUID(),
    cycleId,
    source: "ai",
    title: draft.title,
    description: draft.description,
    estimatedMinutes: draft.estimatedMinutes,
    rationale: draft.rationale,
    isSelected: false,
    createdAt: now,
  }));

  db.actionOptions.push(...saved);
  cycle.updatedAt = now;
  await writeDb(db);
  return saved;
}

export async function selectAction(
  userId: string,
  cycleId: string,
  input:
    | { kind: "existing"; actionOptionId: string }
    | {
        kind: "custom";
        title: string;
        description: string;
        estimatedMinutes: number;
        rationale: string;
      },
) {
  const db = await readDb();
  const cycle = db.cycles.find((item) => item.id === cycleId && item.userId === userId);

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  if (cycle.status !== "reflecting") {
    throw new Error("You can only pick an action while the cycle is reflecting.");
  }

  let selectedId = "";
  const now = new Date().toISOString();

  db.actionOptions = db.actionOptions.map((option) =>
    option.cycleId === cycleId ? { ...option, isSelected: false } : option,
  );

  if (input.kind === "existing") {
    const existing = db.actionOptions.find(
      (option) => option.id === input.actionOptionId && option.cycleId === cycleId,
    );

    if (!existing) {
      throw new Error("Action option not found.");
    }

    existing.isSelected = true;
    selectedId = existing.id;
  } else {
    const customOption: ActionOption = {
      id: crypto.randomUUID(),
      cycleId,
      source: "custom",
      title: input.title,
      description: input.description,
      estimatedMinutes: input.estimatedMinutes,
      rationale: input.rationale,
      isSelected: true,
      createdAt: now,
    };
    db.actionOptions.push(customOption);
    selectedId = customOption.id;
  }

  cycle.selectedActionOptionId = selectedId;
  cycle.status = "pending";
  cycle.updatedAt = now;

  await writeDb(db);
  return bundleCycle(db, cycle);
}

export async function completeCycle(userId: string, cycleId: string) {
  const db = await readDb();
  const cycle = db.cycles.find((item) => item.id === cycleId && item.userId === userId);

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  if (cycle.status !== "pending") {
    throw new Error("Only a pending cycle can be marked complete.");
  }

  cycle.status = "completed";
  cycle.updatedAt = new Date().toISOString();

  await writeDb(db);
  return bundleCycle(db, cycle);
}

export async function saveReview(userId: string, cycleId: string, input: ReviewInput) {
  const db = await readDb();
  const cycle = db.cycles.find((item) => item.id === cycleId && item.userId === userId);

  if (!cycle) {
    throw new Error("Cycle not found.");
  }

  if (cycle.status !== "completed") {
    throw new Error("Only a completed cycle can be reviewed.");
  }

  const now = new Date().toISOString();
  const review: Review = {
    id: crypto.randomUUID(),
    cycleId,
    whatHappened: input.whatHappened,
    emotionalShift: input.emotionalShift,
    engagementScore: input.engagementScore,
    continueWillingness: input.continueWillingness,
    feelMoreStable: input.feelMoreStable,
    surprisedBy: input.surprisedBy,
    createdAt: now,
  };

  db.reviews = db.reviews.filter((item) => item.cycleId !== cycleId);
  db.reviews.push(review);
  cycle.status = "reviewed";
  cycle.updatedAt = now;

  await writeDb(db);
  return bundleCycle(db, cycle);
}

export async function getDashboardSummary(userId: string) {
  const db = await readDb();
  const profile = db.profiles.find((item) => item.userId === userId) ?? null;
  const activeCycle =
    [...db.cycles]
      .filter((item) => item.userId === userId && item.status !== "reviewed")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((cycle) => bundleCycle(db, cycle))[0] ?? null;

  const latestReviewedCycle =
    [...db.cycles]
      .filter((item) => item.userId === userId && item.status === "reviewed")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((cycle) => bundleCycle(db, cycle))[0] ?? null;

  return {
    profile,
    activeCycle,
    latestReviewedCycle,
    nextStep: getNextStep(activeCycle),
  } satisfies DashboardSummary;
}

export async function getHistory(userId: string) {
  const db = await readDb();
  return [...db.cycles]
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((cycle) => bundleCycle(db, cycle));
}
