import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize search value from URL params only (no localStorage)
  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    if (queryFromUrl && pathname.startsWith("/search")) {
      setSearchValue(queryFromUrl);
    }
  }, [searchParams, pathname]);

  // Clear search when navigating away from search page
  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setSearchValue("");
      setIsUserTyping(false); // Reset typing state
    }
  }, [pathname]);

  // Auto navigate when user types (debounced) - only when user is actively typing
  useEffect(() => {
    if (debouncedSearchValue.trim() && isUserTyping) {
      const currentType = searchParams.get("type") || "all";
      const newUrl = `/search?q=${encodeURIComponent(debouncedSearchValue.trim())}&type=${currentType}`;

      // Navigate to search page
      router.push(newUrl);
      setIsUserTyping(false); // Reset after navigation
    }
  }, [debouncedSearchValue, router, searchParams, pathname, isUserTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsUserTyping(true); // Mark as user typing
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
