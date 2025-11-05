import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
  className = "",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const onSearchRef = useRef(onSearch);

  // Update the ref whenever onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSearchRef.current(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 pr-9"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}