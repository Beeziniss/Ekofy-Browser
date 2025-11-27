"use client";

import React from "react";
import { StatusFilter } from "../component/filters/status-filter";
import { RequestSearch } from "../component/filters/request-search";
import { RequestStatus } from "@/gql/graphql";

interface PublicRequestLayoutProps {
  children: React.ReactNode;
  selectedStatus: RequestStatus | "ALL";
  searchQuery: string;
  onStatusChange: (status: RequestStatus | "ALL") => void;
  onSearchChange: (query: string) => void;
  totalCount?: number;
}

export function PublicRequestLayout({
  children,
  selectedStatus,
  searchQuery,
  onStatusChange,
  onSearchChange,
  totalCount = 0,
}: PublicRequestLayoutProps) {
  return (
    <div className="max-w-[1400px] space-y-6 px-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Public Requests</h1>
        <p className="mt-1 text-sm text-gray-400">Manage and moderate public requests</p>
      </div>

      {/* Filters Section - Search and Status in one row */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search Bar */}
        <div className="flex-1">
          <RequestSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
        </div>

        {/* Status Filter Dropdown */}
        <div className="w-full lg:w-48">
          <StatusFilter selectedStatus={selectedStatus} onStatusChange={onStatusChange} />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Found <span className="font-medium text-white">{totalCount}</span> request{totalCount !== 1 ? "s" : ""}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
