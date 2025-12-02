"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PendingRequestsTableHeaderProps {
  totalRequests: number;
}

const PendingRequestsTableHeader = ({ totalRequests }: PendingRequestsTableHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

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
    updateURLParams({ search: query });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-main-white text-2xl font-bold">Pending Upload Requests</h1>
        <Link
          href="/artist/studio/tracks"
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
        >
          <ArrowLeft className="size-4" />
          Back to Tracks
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative max-w-md">
            <Search className="text-main-grey-dark-1 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search pending requests..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-full pl-10"
            />
          </div>

          <span className="text-main-white text-sm">
            {totalRequests} pending request{totalRequests !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsTableHeader;
