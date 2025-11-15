import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "@repo/shared";

interface StatusBadgeProps {
  status: CampaignStatus;
}

const statusConfig: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-green-500 hover:bg-green-600 text-white",
  },
  PAUSED: {
    label: "Paused",
    className: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  ENDED: {
    label: "Ended",
    className: "bg-red-500 hover:bg-red-600 text-white",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-slate-500 hover:bg-slate-600 text-white",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge className={config.className}>{config.label}</Badge>;
}
