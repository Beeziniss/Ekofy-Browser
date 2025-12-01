"use client";

// TODO: Uncomment when GraphQL supports search
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApprovalPriorityStatus } from "@/types/approval-track";

interface TrackApprovalFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: ApprovalPriorityStatus | "ALL";
  onPriorityChange: (priority: ApprovalPriorityStatus | "ALL") => void;
}

export function TrackApprovalFilters({
  // searchTerm and onSearchChange kept for future search functionality
  priorityFilter,
  onPriorityChange,
}: TrackApprovalFiltersProps) {
  // TODO: Uncomment when GraphQL supports search
  // const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSearchChange(localSearchTerm);
  // };

  // const clearSearch = () => {
  //   setLocalSearchTerm("");
  //   onSearchChange("");
  // };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      {/* TODO: Uncomment when GraphQL supports search functionality
      <form onSubmit={handleSearchSubmit} className="max-w-sm flex-1">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search tracks..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pr-9 pl-9"
          />
          {localSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      */}

      {/* Priority Filter */}
      <Select 
        value={priorityFilter} 
        onValueChange={(value) => onPriorityChange(value as ApprovalPriorityStatus | "ALL")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">ALL PRIORITY</SelectItem>
          <SelectItem value={ApprovalPriorityStatus.Urgent}>
          URGENT
          </SelectItem>
          <SelectItem value={ApprovalPriorityStatus.High}>
          HIGH
          </SelectItem>
          <SelectItem value={ApprovalPriorityStatus.Medium}>
            MEDIUM
          </SelectItem>
          <SelectItem value={ApprovalPriorityStatus.Low}>
            LOW
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
