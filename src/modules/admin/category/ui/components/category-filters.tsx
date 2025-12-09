"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { CategoryFilters } from "@/types/category";

interface CategoryFiltersProps {
  filters: CategoryFilters;
  onFilterChange: (filters: Partial<CategoryFilters>) => void;
  onReset: () => void;
}

export function CategoryFiltersComponent({
  filters,
  onFilterChange,
  onReset,
}: CategoryFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm || "");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFilterChange({ searchTerm: value });
  };

  const handleSearchClear = () => {
    setSearchInput("");
    onFilterChange({ searchTerm: "" });
  };

  const hasActiveFilters =
    filters.searchTerm || filters.type || filters.isVisible !== undefined;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, slug, or description..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
        {searchInput && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleSearchClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select
        value={filters.type || "all"}
        onValueChange={(value) =>
          onFilterChange({ type: value === "all" ? undefined : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="GENRE">Genre</SelectItem>
          <SelectItem value="MOOD">Mood</SelectItem>
          <SelectItem value="ACTIVITY">Activity</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          filters.isVisible === undefined
            ? "all"
            : filters.isVisible
            ? "visible"
            : "hidden"
        }
        onValueChange={(value) =>
          onFilterChange({
            isVisible:
              value === "all" ? undefined : value === "visible",
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Visibility</SelectItem>
          <SelectItem value="visible">Visible</SelectItem>
          <SelectItem value="hidden">Hidden</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
