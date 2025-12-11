"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RefundTransactionStatus } from "@/gql/graphql";

interface RefundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter?: RefundTransactionStatus;
  onStatusChange?: (value: RefundTransactionStatus | undefined) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
}

export function RefundFilters({ 
  searchTerm, 
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy = "date-desc",
  onSortChange
}: RefundFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by refund ID, amount, or payment ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-400" />
            
            {/* Status Filter */}
            {onStatusChange && (
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={RefundTransactionStatus.Succeeded}>Succeeded</SelectItem>
                  <SelectItem value={RefundTransactionStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={RefundTransactionStatus.Failed}>Failed</SelectItem>
                  <SelectItem value={RefundTransactionStatus.Canceled}>Canceled</SelectItem>
                  {/* <SelectItem value={RefundTransactionStatus.RequiresAction}>Requires Action</SelectItem> */}
                </SelectContent>
              </Select>
            )}

            {/* Sort Filter */}
            {onSortChange && (
              <Select
                value={sortBy}
                onValueChange={onSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
