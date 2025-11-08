import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search...", onSearch, initialValue = "", className = "" }: SearchBarProps) {
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
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-9 pl-9"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
