"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="max-w-[1400px] space-y-4 px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Public Requests</h1>
        <p className="mt-1 text-sm text-gray-400">Manage and moderate public requests</p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Status Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Status</label>
            <StatusFilter selectedStatus={selectedStatus} onStatusChange={onStatusChange} />
          </div>

          {/* Search */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Search</label>
            <RequestSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />
          </div>

          {/* Results Count */}
          <div className="text-xs text-gray-400">
            Found <span className="font-medium text-white">{totalCount}</span> request{totalCount !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
