"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoyaltyPoliciesQuery } from "@/gql/graphql";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyVND } from "@/utils/format-currency";

type RoyaltyPolicy = NonNullable<
  NonNullable<RoyaltyPoliciesQuery["royaltyPolicies"]>["items"]
>[number];

interface RoyaltyPolicyTableProps {
  policies: RoyaltyPolicy[];
  isLoading?: boolean;
  onView?: (policy: RoyaltyPolicy) => void;
  onEdit?: (policy: RoyaltyPolicy) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "INACTIVE":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "ACTIVE";
    case "INACTIVE":
      return "INACTIVE";
    default:
      return status;
  }
};

export function RoyaltyPolicyTable({
  policies,
  isLoading,
}: RoyaltyPolicyTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No royalty policies found</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            You haven&apos;t created any royalty policies yet. Start by creating a new policy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Rate Per Stream</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Recording %</TableHead>
            <TableHead>Work %</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
                <TableCell>{policies.indexOf(policy) + 1}</TableCell>
              <TableCell className="font-medium">
                {formatCurrencyVND(policy.ratePerStream)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{policy.currency}</Badge>
              </TableCell>
              <TableCell>{Number(policy.recordingPercentage)}%</TableCell>
              <TableCell>{Number(policy.workPercentage)}%</TableCell>
              <TableCell>
                {policy.version.toString()}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(policy.status)}>
                  {getStatusLabel(policy.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(policy.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
