"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefundTransactionStatus } from "@/gql/graphql";

interface RefundTransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: RefundTransactionStatus;
  onStatusChange: (value: RefundTransactionStatus | undefined) => void;
}

export function RefundTransactionFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: RefundTransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="search" className="text-gray-300">
          Search
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search refund transactions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="w-full space-y-2 sm:w-[200px]">
        <Label htmlFor="status" className="text-gray-300">
          Refund Status
        </Label>
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onStatusChange(undefined);
            } else {
              onStatusChange(value as RefundTransactionStatus);
            }
          }}
        >
          <SelectTrigger id="status" className="border-gray-700 bg-gray-800 text-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all" className="text-white">
              All Statuses
            </SelectItem>
            <SelectItem value={RefundTransactionStatus.Pending} className="text-white">
              Pending
            </SelectItem>
            <SelectItem value={RefundTransactionStatus.Succeeded} className="text-white">
              Succeeded
            </SelectItem>
            <SelectItem value={RefundTransactionStatus.RequiresAction} className="text-white">
              Requires Action
            </SelectItem>
            <SelectItem value={RefundTransactionStatus.Failed} className="text-white">
              Failed
            </SelectItem>
            <SelectItem value={RefundTransactionStatus.Canceled} className="text-white">
              Canceled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
