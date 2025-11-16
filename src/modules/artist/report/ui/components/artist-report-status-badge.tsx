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
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    variant: "secondary" as const,
    className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    variant: "secondary" as const,
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  },
  [ReportStatus.Dismissed]: {
    label: "Dismissed",
    variant: "secondary" as const,
    className: "bg-rose-100 text-rose-800 hover:bg-rose-200",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    variant: "secondary" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
};

export function ArtistReportStatusBadge({ status, className }: ArtistReportStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        Undefined
      </Badge>
    );
  }

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}