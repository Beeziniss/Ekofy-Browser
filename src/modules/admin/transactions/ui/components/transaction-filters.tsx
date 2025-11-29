"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentTransactionStatus } from "@/gql/graphql";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: PaymentTransactionStatus;
  onStatusChange: (value: PaymentTransactionStatus | undefined) => void;
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: TransactionFiltersProps) {
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

      <div className="w-full sm:w-[200px] space-y-2">
        <Label htmlFor="status" className="text-gray-300">
          Payment Status
        </Label>
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onStatusChange(undefined);
            } else {
              onStatusChange(value as PaymentTransactionStatus);
            }
          }}
        >
          <SelectTrigger id="status" className="border-gray-700 bg-gray-800 text-white">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={PaymentTransactionStatus.Paid}>Paid</SelectItem>
            <SelectItem value={PaymentTransactionStatus.Pending}>Pending</SelectItem>
            <SelectItem value={PaymentTransactionStatus.Unpaid}>Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
