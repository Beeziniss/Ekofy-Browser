"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function OrderDisputedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, router, searchParams]);

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search by order ID, client name, or artist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-gray-700 bg-gray-800 pl-10 text-gray-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
