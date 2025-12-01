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
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoyaltyPoliciesQuery } from "@/gql/graphql";
import { formatDate } from "@/utils/format-date";
import { Skeleton } from "@/components/ui/skeleton";

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
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "PENDING":
      return "Pending";
    default:
      return status;
  }
};

export function RoyaltyPolicyTable({
  policies,
  isLoading,
  onView,
  onEdit,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rate Per Stream</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Recording %</TableHead>
            <TableHead>Work %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: policy.currency,
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                }).format(Number(policy.ratePerStream))}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{policy.currency}</Badge>
              </TableCell>
              <TableCell>{Number(policy.recordingPercentage).toFixed(2)}%</TableCell>
              <TableCell>{Number(policy.workPercentage).toFixed(2)}%</TableCell>
              <TableCell>
                <Badge className={getStatusColor(policy.status)}>
                  {getStatusLabel(policy.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">v{policy.version.toString()}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(policy.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(policy)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(policy)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Policy
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
