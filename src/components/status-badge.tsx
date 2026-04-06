import { type CycleStatus } from "@/lib/types";

const labels: Record<CycleStatus, string> = {
  reflecting: "Reflecting",
  pending: "Pending",
  completed: "Completed",
  reviewed: "Reviewed",
};

export function StatusBadge({ status }: { status: CycleStatus }) {
  return <span className={`status-pill status-${status} text-[var(--foreground)]`}>{labels[status]}</span>;
}
