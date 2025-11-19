"use client";

import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface ArtistReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig = {
  [ReportStatus.Pending]: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    variant: "secondary" as const,
    className: "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    variant: "secondary" as const,
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30",
  },
  [ReportStatus.Restored]: {
    label: "Restored",
    variant: "secondary" as const,
    className: "bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    variant: "secondary" as const,
    className: "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    variant: "secondary" as const,
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30",
  },
};

export function ArtistReportStatusBadge({ status, className }: ArtistReportStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        UNDEFINED
      </Badge>
    );
  }

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label.toUpperCase()}
    </Badge>
  );
}