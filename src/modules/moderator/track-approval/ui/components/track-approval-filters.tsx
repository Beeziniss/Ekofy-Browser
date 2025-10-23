"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface TrackApprovalFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function TrackApprovalFilters({
  searchTerm,
  onSearchChange,
}: TrackApprovalFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [trackTypeFilter, setTrackTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchTerm);
  };

  const clearSearch = () => {
    setLocalSearchTerm("");
    onSearchChange("");
  };

  const clearAllFilters = () => {
    setLocalSearchTerm("");
    setTrackTypeFilter("all");
    setStatusFilter("pending");
    onSearchChange("");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {localSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Track Type Filter */}
      <Select value={trackTypeFilter} onValueChange={setTrackTypeFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Track Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="original">Original</SelectItem>
          <SelectItem value="cover">Cover</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="live">Live</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}

      {/* Filter Actions */}
      <div className="flex items-center gap-2">
        {(localSearchTerm || trackTypeFilter !== "all" || statusFilter !== "pending") && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}