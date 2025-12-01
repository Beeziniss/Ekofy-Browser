"use client";

import { Badge } from "@/components/ui/badge";
import { ReportStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig = {
  [ReportStatus.Pending]: {
    label: "Pending",
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  [ReportStatus.UnderReview]: {
    label: "Under Review",
    variant: "secondary" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  [ReportStatus.Approved]: {
    label: "Approved",
    variant: "secondary" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  [ReportStatus.Restored]: {
    label: "Restored",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  [ReportStatus.Rejected]: {
    label: "Rejected",
    variant: "secondary" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  [ReportStatus.Escalated]: {
    label: "Escalated",
    variant: "secondary" as const,
    className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  },
};

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        Unknown
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