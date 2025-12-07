"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface OrderDisputedSearchProps {
  onSearchChange: (search: string) => void;
  initialValue?: string;
}

export function OrderDisputedSearch({ onSearchChange, initialValue = "" }: OrderDisputedSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search by Client, Artist..."
        value={searchTerm}
        onChange={handleChange}
        className="border-gray-700 bg-gray-800 pl-10 text-gray-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
