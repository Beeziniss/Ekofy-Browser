"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { RequestStatus } from "@/gql/graphql";

interface PendingRequestFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string | undefined) => void;
  searchValue: string;
  statusValue: string | undefined;
}

export function PendingRequestFilters({
  onSearchChange,
  onStatusChange,
  searchValue,
  statusValue,
}: PendingRequestFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, requestor name..."
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusValue || "all"} onValueChange={(value) => onStatusChange(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL STATUS</SelectItem>
            <SelectItem value={RequestStatus.Pending}>PENDING</SelectItem>
            <SelectItem value={RequestStatus.Confirmed}>CONFIRMED</SelectItem>
            <SelectItem value={RequestStatus.Rejected}>REJECTED</SelectItem>
            <SelectItem value={RequestStatus.Canceled}>CANCELED</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}