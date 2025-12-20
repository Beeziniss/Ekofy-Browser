"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import SemanticIcon from "./semantic/semantic-icon";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  // const [shouldSearch, setShouldSearch] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize search value from URL params only (no localStorage)
  useEffect(() => {
    if (initialized) return;

    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl && pathname.startsWith("/search")) {
      setSearchValue(queryFromUrl);
      // setShouldSearch(false); // Don't trigger search on init
    }

    setInitialized(true);
  }, [searchParams, pathname, initialized]);

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setSearchValue("");
      // setShouldSearch(false); // Stop any pending searches
    }
  }, [pathname]);

  useEffect(() => {
    if (debouncedSearchValue === searchValue) {
      setIsTyping(false);
    }
  }, [debouncedSearchValue, searchValue]);

  useEffect(() => {
    if (!initialized) return;

    const trimmed = debouncedSearchValue.trim();

    // Only trigger if user typed something
    if (isTyping && trimmed !== "" && !pathname.startsWith("/search")) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&type=all`);
    }
  }, [debouncedSearchValue, initialized, pathname, router, isTyping]);

  // Auto navigate when debounced value changes AND shouldSearch is true
  useEffect(() => {
    if (!initialized) return;

    if (!pathname.startsWith("/search")) return;

    const trimmed = debouncedSearchValue.trim();
    const currentType = searchParams.get("type") || "all";
    const currentQuery = searchParams.get("q") || "";

    if (trimmed === "") {
      if (pathname.startsWith("/search")) {
        router.push(`/search?type=${currentType}`);
      }
      return;
    }

    if (trimmed !== currentQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&type=${currentType}`);
    }
  }, [debouncedSearchValue, initialized, pathname, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // setShouldSearch(true); // Mark that user wants to search
    setIsTyping(true);
  };

  return (
    <div className="flex items-center gap-x-2">
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

      {/* Semantic Search -- For Premium only */}
      <SemanticIcon />
    </div>
  );
};

export default SearchBar;
