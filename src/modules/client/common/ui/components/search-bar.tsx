import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search value from URL params or localStorage on mount
  useEffect(() => {
    // First check URL params
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setSearchValue(queryFromUrl);
      // Save to localStorage
      localStorage.setItem('search-query', queryFromUrl);
    } else {
      // Then check localStorage
      const savedQuery = localStorage.getItem('search-query');
      if (savedQuery) {
        setSearchValue(savedQuery);
      }
    }
  }, [searchParams]);

  // Auto navigate when user types (debounced)
  useEffect(() => {
    if (debouncedSearchValue.trim()) {
      // Save to localStorage
      localStorage.setItem('search-query', debouncedSearchValue.trim());
      // Navigate to search page
      router.push(`/search?q=${encodeURIComponent(debouncedSearchValue.trim())}`);
    } else {
      // Clear localStorage if search is empty
      localStorage.removeItem('search-query');
    }
  }, [debouncedSearchValue, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // Save to localStorage immediately for better UX
    if (value.trim()) {
      localStorage.setItem('search-query', value);
    }
  };

  return (
    <div className="relative appearance-none">
      <Search className="absolute top-1/2 left-4 size-6 -translate-y-1/2 text-[#f2f2f2]" />

      <Separator
        orientation="vertical"
        className="absolute top-1/2 left-14 !h-6 -translate-y-1/2 bg-[#f2f2f2]"
      />

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
