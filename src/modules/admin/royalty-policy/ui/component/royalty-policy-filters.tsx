"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyType, PolicyStatus } from "@/gql/graphql";
import { useDebounce } from "use-debounce";

interface RoyaltyPolicyFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    currency?: CurrencyType;
    status?: PolicyStatus;
  }) => void;
}

export function RoyaltyPolicyFilters({ onFiltersChange }: RoyaltyPolicyFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currency, setCurrency] = useState<CurrencyType | "ALL">("ALL");
  const [status, setStatus] = useState<PolicyStatus | "ALL">("ALL");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Update the ref whenever onFiltersChange changes
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  useEffect(() => {
    onFiltersChangeRef.current({
      search: debouncedSearchTerm || undefined,
      currency: currency !== "ALL" ? currency : undefined,
      status: status !== "ALL" ? status : undefined,
    });
  }, [debouncedSearchTerm, currency, status]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrency("ALL");
    setStatus("ALL");
  };

  const hasActiveFilters = searchTerm || currency !== "ALL" || status !== "ALL";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9 pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Currency Filter */}
        <Select
          value={currency}
          onValueChange={(value) => setCurrency(value as CurrencyType | "ALL")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Currencies</SelectItem>
            <SelectItem value={CurrencyType.Vnd}>VND</SelectItem>
            <SelectItem value={CurrencyType.Usd}>USD</SelectItem>
            <SelectItem value={CurrencyType.Eur}>EUR</SelectItem>
            <SelectItem value={CurrencyType.Gbp}>GBP</SelectItem>
            <SelectItem value={CurrencyType.Jpy}>JPY</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as PolicyStatus | "ALL")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value={PolicyStatus.Active}>Active</SelectItem>
            <SelectItem value={PolicyStatus.Inactive}>Inactive</SelectItem>
            <SelectItem value={PolicyStatus.Pending}>Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
