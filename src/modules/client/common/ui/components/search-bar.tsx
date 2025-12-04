"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize search value from URL params only (no localStorage)
  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl && pathname.startsWith("/search")) {
      setSearchValue(queryFromUrl);
      setShouldSearch(false); // Don't trigger search on init
    }
  }, [searchParams, pathname]);

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setSearchValue("");
      setShouldSearch(false); // Stop any pending searches
    }
  }, [pathname]);

  // Auto navigate when debounced value changes AND shouldSearch is true
  useEffect(() => {
    if (debouncedSearchValue.trim() && shouldSearch) {
      if (pathname.startsWith("/search")) {
        const currentType = searchParams.get("type") || "all";
        const currentQuery = searchParams.get("q");
        
        // Only navigate if the search term is different from current URL
        if (currentQuery !== debouncedSearchValue.trim()) {
          const newUrl = `/search?q=${encodeURIComponent(debouncedSearchValue.trim())}&type=${currentType}`;
          router.push(newUrl);
        }
      } else {
        // If not on search page and user types, navigate to search
        const newUrl = `/search?q=${encodeURIComponent(debouncedSearchValue.trim())}&type=all`;
        router.push(newUrl);
      }
      setShouldSearch(false); // Reset after navigation
    }
  }, [debouncedSearchValue, shouldSearch, router, searchParams, pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShouldSearch(true); // Mark that user wants to search
  };

  return (
    <div className="relative appearance-none">
      <Search className="absolute top-1/2 left-4 size-6 -translate-y-1/2 text-[#f2f2f2]" />

      <Separator orientation="vertical" className="absolute top-1/2 left-14 !h-6 -translate-y-1/2 bg-[#f2f2f2]" />

      <Input
        type="text"
        placeholder="What do you want to play?"
        value={searchValue}
        onChange={handleInputChange}
        className="min-w-[420px] rounded-md border-0 !bg-[#2E2E2E] px-4 !py-2.5 pl-20 text-[#f2f2f2] placeholder:text-[#999999]"
      />
    </div>
  );
};

export default SearchBar;
