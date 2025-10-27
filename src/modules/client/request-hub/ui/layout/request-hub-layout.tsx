"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  // Filter, 
  Plus, 
  Users
} from "lucide-react";

interface RequestHubLayoutProps {
  children: ReactNode;
  onPostRequest?: () => void;
  onBrowseArtists?: () => void;
  showFilters?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function RequestHubLayout({ 
  children, 
  onPostRequest,
  onBrowseArtists,
  showFilters = true,
  searchValue = "",
  onSearchChange
}: RequestHubLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Title and Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary-gradient mb-2">Request Hub</h1>
              <p className="text-gray-600">Find the perfect artist for your project</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onBrowseArtists}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Browse Artists
              </Button>
              <Button 
                onClick={onPostRequest}
                className="primary_gradient hover:opacity-65 text-white flex items-center gap-2 transition-smooth"
              >
                <Plus className="h-4 w-4" />
                Post Request
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              {/* <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button> */}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}