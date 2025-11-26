import React from "react";
import { SearchType, SEARCH_TABS } from "@/types/search";
import { cn } from "@/lib/utils";

interface SearchLayoutProps {
  children: React.ReactNode;
  currentType: SearchType;
  onTypeChange: (type: SearchType) => void;
  query: string;
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({
  children,
  currentType,
  onTypeChange,
  // query
}) => {
  return (
    <div className="flex flex-col space-y-6 p-12">
      {/* Search Header */}
      <div className="space-y-4">
        {/* Search Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {SEARCH_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                currentType === tab.id ? "bg-white text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};
