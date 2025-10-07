"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArtistApprovalTable } from "../component";
import { moderatorArtistsQueryOptions } from "@/gql/options/moderator-options";

export function ArtistApprovalSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search term changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: artistsData,
    isLoading,
    error,
  } = useQuery(moderatorArtistsQueryOptions(currentPage, pageSize, debouncedSearchTerm));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading artists: {error.message}</div>
      </div>
    );
  }

  const artists = artistsData?.artists?.items || [];
  const totalCount = artistsData?.artists?.totalCount || 0;
  const pageInfo = artistsData?.artists?.pageInfo;

  return (
    <div className="space-y-6">
      <ArtistApprovalTable
        data={artists as any[]}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        hasNextPage={pageInfo?.hasNextPage || false}
        hasPreviousPage={pageInfo?.hasPreviousPage || false}
        searchTerm={searchTerm}
      />
    </div>
  );
}