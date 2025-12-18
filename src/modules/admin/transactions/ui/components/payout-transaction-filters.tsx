"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PayoutTransactionStatus } from "@/gql/graphql";

interface PayoutTransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: PayoutTransactionStatus;
  onStatusChange: (value: PayoutTransactionStatus | undefined) => void;
}

export function PayoutTransactionFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: PayoutTransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="search" className="text-gray-300">
          Search
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="w-full space-y-2 sm:w-[200px]">
        <Label htmlFor="status" className="text-gray-300">
          Payout Status
        </Label>
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onStatusChange(undefined);
            } else {
              onStatusChange(value as PayoutTransactionStatus);
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
            <SelectItem value={PayoutTransactionStatus.Pending} className="text-white">
              Pending
            </SelectItem>
            <SelectItem value={PayoutTransactionStatus.Paid} className="text-white">
              Paid
            </SelectItem>
            <SelectItem value={PayoutTransactionStatus.InTransit} className="text-white">
              In Transit
            </SelectItem>
            <SelectItem value={PayoutTransactionStatus.Failed} className="text-white">
              Failed
            </SelectItem>
            <SelectItem value={PayoutTransactionStatus.Canceled} className="text-white">
              Canceled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
