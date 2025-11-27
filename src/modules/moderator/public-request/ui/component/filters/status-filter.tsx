"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStatus } from "@/gql/graphql";

interface StatusFilterProps {
  selectedStatus: RequestStatus | "ALL";
  onStatusChange: (status: RequestStatus | "ALL") => void;
}

const statusOptions = [
  { label: "All Status", value: "ALL" as const },
  { label: "Open", value: RequestStatus.Open },
  { label: "Blocked", value: RequestStatus.Blocked },
];

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <Select value={selectedStatus} onValueChange={onStatusChange}>
      <SelectTrigger className="w-full lg:w-48">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
