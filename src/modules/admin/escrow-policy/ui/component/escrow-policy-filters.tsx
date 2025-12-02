"use client";

import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolicyStatus } from "@/gql/graphql";

interface EscrowPolicyFiltersProps {
  onFiltersChange: (filters: {
    status?: PolicyStatus;
  }) => void;
  initialStatus?: PolicyStatus;
}

export function EscrowPolicyFilters({ onFiltersChange, initialStatus }: EscrowPolicyFiltersProps) {
  const [status, setStatus] = useState<PolicyStatus | "ALL">(initialStatus || "ALL");
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Update the ref whenever onFiltersChange changes
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  useEffect(() => {
    onFiltersChangeRef.current({
      status: status !== "ALL" ? status : undefined,
    });
  }, [status]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-2">
        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as PolicyStatus | "ALL")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="STATUS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL STATUS</SelectItem>
            <SelectItem value={PolicyStatus.Active}>ACTIVE</SelectItem>
            <SelectItem value={PolicyStatus.Inactive}>INACTIVE</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
