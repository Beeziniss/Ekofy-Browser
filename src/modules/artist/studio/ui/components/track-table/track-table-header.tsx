"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

interface TrackTableHeaderProps {
  totalTracks: number;
  serverTotalCount?: number;
  // onSearch?: (query: string) => void;
  // onPrivacyFilter?: (filter: string) => void;
  // onSort?: (sortBy: string, sortOrder: string) => void;
}

const TrackTableHeader = ({
  totalTracks,
  serverTotalCount,
  // onSearch,
  // onPrivacyFilter,
  // onSort,
}: TrackTableHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  /* useEffect(() => {
    // Initialize state from URL params
    const search = searchParams.get("search") || "";
    const privacy = searchParams.get("privacy") || "all";
    const sortBy = searchParams.get("sortBy") || "";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    setSearchQuery(search);
    onSearch?.(search);
    onPrivacyFilter?.(privacy);
    if (sortBy) {
      onSort?.(sortBy, sortOrder);
    }
  }, [searchParams, onSearch, onPrivacyFilter, onSort]); */

  const updateURLParams = (params: { [key: string]: string }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === "all") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${window.location.pathname}${query}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // onSearch?.(query);
    updateURLParams({ search: query });
  };

  const handlePrivacyFilter = (value: string) => {
    // onPrivacyFilter?.(value);
    updateURLParams({ privacy: value });
  };

  const handleSort = (sortBy: string) => {
    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder") || "desc";

    // Toggle sort order if same column, otherwise default to desc
    const newSortOrder = currentSortBy === sortBy && currentSortOrder === "desc" ? "asc" : "desc";

    // onSort?.(sortBy, newSortOrder);
    updateURLParams({ sortBy, sortOrder: newSortOrder });
  };

  const currentPrivacy = searchParams.get("privacy") || "all";
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md">
          <Search className="text-main-grey-dark-1 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search tracks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-full pl-10"
          />
        </div>

        <span className="text-main-white text-sm">
          {totalTracks} track{totalTracks !== 1 ? "s" : ""}
          {serverTotalCount && totalTracks !== serverTotalCount && (
            <span className="text-main-grey ml-1">of {serverTotalCount} total</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Select value={currentPrivacy} onValueChange={handlePrivacyFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-main-grey-dark-1 flex items-center gap-2 hover:text-white">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 7l4-4m0 0l4-4m-4 4V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3h4"
                />
              </svg>
              Sort {currentSortBy && `(${currentSortBy})`}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("releaseDate")} className="flex items-center justify-between">
              Date
              {currentSortBy === "releaseDate" && (
                <span className="text-xs">{currentSortOrder === "desc" ? "↓" : "↑"}</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("streamCount")} className="flex items-center justify-between">
              Streams
              {currentSortBy === "streamCount" && (
                <span className="text-xs">{currentSortOrder === "desc" ? "↓" : "↑"}</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("favoriteCount")} className="flex items-center justify-between">
              Favorites
              {currentSortBy === "favoriteCount" && (
                <span className="text-xs">{currentSortOrder === "desc" ? "↓" : "↑"}</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TrackTableHeader;
