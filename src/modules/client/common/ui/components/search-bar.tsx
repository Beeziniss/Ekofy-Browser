import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const router = useRouter();

  // Auto navigate when user types (debounced)
  useEffect(() => {
    if (debouncedSearchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearchValue.trim())}`);
    }
  }, [debouncedSearchValue, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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
