"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center text-sm text-gray-300">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading || totalPages <= 1}
          className="flex items-center border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {totalPages <= 1 ? (
            <Button variant="default" size="sm" disabled className="min-w-[40px] bg-main-dark-bg text-white">
              1
            </Button>
          ) : (
            generatePageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={`min-w-[40px] ${
                      currentPage === page 
                        ? "bg-purple-600 text-white hover:bg-purple-700" 
                        : "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading || totalPages <= 1}
          className="flex items-center border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
