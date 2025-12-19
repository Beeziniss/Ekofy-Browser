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
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import { FingerprintConfidencePolicyQuery } from "@/gql/graphql";

type FingerprintConfidencePolicy = NonNullable<
  FingerprintConfidencePolicyQuery["fingerprintConfidencePolicy"]
>;

interface FingerprintTableProps {
  policy: FingerprintConfidencePolicy | null;
  isLoading?: boolean;
}

export function FingerprintTable({
  policy,
  isLoading,
}: FingerprintTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No policy configured</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            Fingerprint confidence policy has not been configured yet. Configure it to start managing content matching thresholds.
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
            <TableHead>ID</TableHead>
            <TableHead>Reject Threshold</TableHead>
            <TableHead>Manual Review Threshold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Badge variant="outline">{policy.id}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {policy.rejectThreshold}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {policy.manualReviewThreshold}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

