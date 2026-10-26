import type { RequestStatus } from "../../services/w3/requestTypes";

const LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`w3r-badge w3r-badge--${status}`}>{LABELS[status]}</span>;
}
