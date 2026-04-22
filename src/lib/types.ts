export type CycleStatus = "reflecting" | "pending" | "completed" | "reviewed";

export type ActionSource = "ai" | "custom";

export type ThemeOption =
  | "interest"
  | "career"
  | "relationships"
  | "habits"
  | "values";

export type EffortLevel =
  | "2 minutes"
  | "5 minutes"
  | "10 minutes"
  | "only prepare"
  | "only make a draft"
  | "only break it down";

export type EnergyLevel = "low" | "medium" | "high";

export type EmotionalShift =
  | "worse"
  | "about the same"
  | "a little better"
  | "much better";

export interface SessionUser {
  userId: string;
  email: string;
  displayName: string;
}

export interface Profile {
  userId: string;
  email: string;
  displayName: string;
  focusArea: string;
  focusNote?: string;
  createdAt: string;
}

export interface Cycle {
  id: string;
  userId: string;
  theme: ThemeOption;
  emotion: string;
  energyLevel: EnergyLevel;
  blocker: string;
  resistanceReason: string;
  effortLevel: EffortLevel;
  desiredOutcome: string;
  reflectionText: string;
  status: CycleStatus;
  selectedActionOptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActionOption {
  id: string;
  cycleId: string;
  source: ActionSource;
  title: string;
  description: string;
  estimatedMinutes: number;
  rationale: string;
  isSelected: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  cycleId: string;
  whatHappened: string;
  emotionalShift: EmotionalShift;
  engagementScore: number;
  continueWillingness: number;
  feelMoreStable: boolean;
  surprisedBy: string;
  createdAt: string;
}

export interface CycleBundle {
  cycle: Cycle;
  options: ActionOption[];
  selectedAction: ActionOption | null;
  review: Review | null;
}

export interface DashboardSummary {
  profile: Profile | null;
  activeCycle: CycleBundle | null;
  latestReviewedCycle: CycleBundle | null;
  nextStep: {
    label: string;
    href: string;
    description: string;
  };
}

export interface CreateCycleInput {
  theme: ThemeOption;
  emotion: string;
  energyLevel: EnergyLevel;
  blocker: string;
  resistanceReason: string;
  effortLevel: EffortLevel;
  desiredOutcome: string;
  reflectionText: string;
}

export interface DraftActionOption {
  title: string;
  description: string;
  estimatedMinutes: number;
  rationale: string;
}

export interface ReviewInput {
  whatHappened: string;
  emotionalShift: EmotionalShift;
  engagementScore: number;
  continueWillingness: number;
  feelMoreStable: boolean;
  surprisedBy: string;
}

export interface DemoDb {
  profiles: Profile[];
  cycles: Cycle[];
  actionOptions: ActionOption[];
  reviews: Review[];
}
