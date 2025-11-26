"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  selectedStatus: RequestStatus | "ALL";
  onStatusChange: (status: RequestStatus | "ALL") => void;
}

const statusOptions = [
  { label: "All Requests", value: "ALL" as const },
  { label: "Open", value: RequestStatus.Open },
  { label: "Blocked", value: RequestStatus.Blocked },
];

export function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => {
        const isSelected = selectedStatus === option.value;
        return (
          <Button
            key={option.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(option.value)}
            className={cn(
              "transition-colors",
              isSelected && "bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white hover:opacity-90"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
