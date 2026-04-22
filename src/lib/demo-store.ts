import { deflateRawSync, inflateRawSync } from "node:zlib";
import { cookies } from "next/headers";
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

const DB_COOKIE_KEY = "momentum_demo_db";
const DB_COOKIE_META_KEY = "momentum_demo_db_parts";
const DB_COOKIE_CHUNK_SIZE = 3000;
const MAX_DB_COOKIE_PARTS = 10;
const MAX_STORED_CYCLES = 12;
const MAX_STORED_PROFILES = 6;

function createEmptyDb(): DemoDb {
  return {
    profiles: [],
    cycles: [],
    actionOptions: [],
    reviews: [],
  };
}

function normalizeDb(input: unknown): DemoDb {
  if (!input || typeof input !== "object") {
    return createEmptyDb();
  }

  const parsed = input as Partial<DemoDb>;

  return {
    profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
    cycles: Array.isArray(parsed.cycles) ? parsed.cycles : [],
    actionOptions: Array.isArray(parsed.actionOptions) ? parsed.actionOptions : [],
    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
  };
}

function splitIntoChunks(value: string, chunkSize: number) {
  const chunks: string[] = [];

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }

  return chunks;
}

function trimDb(db: DemoDb): DemoDb {
  const cycles = [...db.cycles]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_STORED_CYCLES);
  const cycleIds = new Set(cycles.map((cycle) => cycle.id));
  const profileIds = new Set(
    [...db.profiles]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, MAX_STORED_PROFILES)
      .map((profile) => profile.userId),
  );

  return {
    profiles: db.profiles.filter((profile) => profileIds.has(profile.userId)),
    cycles,
    actionOptions: db.actionOptions.filter((option) => cycleIds.has(option.cycleId)),
    reviews: db.reviews.filter((review) => cycleIds.has(review.cycleId)),
  };
}

function serializeDb(db: DemoDb) {
  return deflateRawSync(JSON.stringify(trimDb(db))).toString("base64url");
}

function deserializeDb(value: string) {
  const raw = inflateRawSync(Buffer.from(value, "base64url")).toString("utf8");
  return normalizeDb(JSON.parse(raw));
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

function expireCookie(cookieStore: Awaited<ReturnType<typeof cookies>>, name: string) {
  cookieStore.set(name, "", {
    ...getCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });
}

async function readDb() {
  const cookieStore = await cookies();
  const chunkCount = Number(cookieStore.get(DB_COOKIE_META_KEY)?.value ?? "0");

  if (!Number.isInteger(chunkCount) || chunkCount <= 0) {
    return createEmptyDb();
  }

  const raw = Array.from({ length: chunkCount }, (_, index) =>
    cookieStore.get(`${DB_COOKIE_KEY}_${index}`)?.value ?? "",
  ).join("");

  if (!raw) {
    return createEmptyDb();
  }

  try {
    return deserializeDb(raw);
  } catch {
    return createEmptyDb();
  }
}

async function writeDb(db: DemoDb) {
  const cookieStore = await cookies();
  const serialized = serializeDb(db);
  const chunks = splitIntoChunks(serialized, DB_COOKIE_CHUNK_SIZE);

  if (chunks.length > MAX_DB_COOKIE_PARTS) {
    throw new Error("Demo data is full for this browser session. Start a new session or clear older history.");
  }

  const previousChunkCount = Number(cookieStore.get(DB_COOKIE_META_KEY)?.value ?? "0");
  const options = getCookieOptions();

  cookieStore.set(DB_COOKIE_META_KEY, String(chunks.length), options);

  chunks.forEach((chunk, index) => {
    cookieStore.set(`${DB_COOKIE_KEY}_${index}`, chunk, options);
  });

  for (let index = chunks.length; index < previousChunkCount; index += 1) {
    expireCookie(cookieStore, `${DB_COOKIE_KEY}_${index}`);
  }
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
  input: { displayName: string; focusArea: string; focusNote?: string },
) {
  const db = await readDb();
  const now = new Date().toISOString();
  const existingIndex = db.profiles.findIndex((profile) => profile.userId === session.userId);
  const existingProfile = existingIndex >= 0 ? db.profiles[existingIndex] : null;

  const profile: Profile = {
    userId: session.userId,
    email: session.email,
    displayName: input.displayName || session.displayName,
    focusArea: input.focusArea,
    focusNote: input.focusNote ?? existingProfile?.focusNote ?? "",
    createdAt: existingProfile?.createdAt ?? now,
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
