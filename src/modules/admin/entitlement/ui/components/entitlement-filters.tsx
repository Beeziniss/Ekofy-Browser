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
import { EntitlementFilters } from "@/types/entitlement";
import { EntitlementValueType } from "@/gql/graphql";

interface EntitlementFiltersProps {
  filters: EntitlementFilters;
  onFilterChange: (filters: Partial<EntitlementFilters>) => void;
  onReset: () => void;
}

export function EntitlementFiltersComponent({
  filters,
  onFilterChange,
  onReset,
}: EntitlementFiltersProps) {
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
    filters.searchTerm || filters.isActive !== undefined || filters.valueType;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or code"
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
        value={
          filters.isActive === undefined
            ? "all"
            : filters.isActive
            ? "active"
            : "inactive"
        }
        onValueChange={(value) =>
          onFilterChange({
            isActive: value === "all" ? undefined : value === "active",
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.valueType || "all"}
        onValueChange={(value) =>
          onFilterChange({ valueType: value === "all" ? undefined : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by value type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value={EntitlementValueType.String}>String</SelectItem>
          <SelectItem value={EntitlementValueType.Boolean}>Boolean</SelectItem>
          <SelectItem value={EntitlementValueType.Int}>Int</SelectItem>
          <SelectItem value={EntitlementValueType.Double}>Double</SelectItem>
          <SelectItem value={EntitlementValueType.Decimal}>Decimal</SelectItem>
          <SelectItem value={EntitlementValueType.Long}>Long</SelectItem>
          <SelectItem value={EntitlementValueType.DateTime}>DateTime</SelectItem>
          <SelectItem value={EntitlementValueType.Array}>Array</SelectItem>
          <SelectItem value={EntitlementValueType.Object}>Object</SelectItem>
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

