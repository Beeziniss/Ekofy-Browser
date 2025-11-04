"use client";

import { SearchIcon, ArrowRightIcon, HomeIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouteSearch } from "@/hooks/use-route-search";
import { ScrollArea } from "@/components/ui/scroll-area";

const Page = () => {
  const { query, setQuery, results, isSearching, navigateToRoute } =
    useRouteSearch();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (!results.length) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1,
          );
          break;
        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            navigateToRoute(results[selectedIndex].path);
          } else if (results[0]) {
            navigateToRoute(results[0].path);
          }
          break;
        case "Escape":
          setQuery("");
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [results, selectedIndex, navigateToRoute, setQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-2xl">
        <Empty>
          <EmptyHeader>
            <EmptyTitle className="mb-2 text-4xl">
              4<span className="text-main-purple">0</span>4 - Not Found
            </EmptyTitle>
            <EmptyDescription className="text-base/relaxed">
              The page you&apos;re looking for doesn&apos;t exist. Try searching
              for what you need below.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="w-full space-y-4">
            <div className="relative w-full">
              <InputGroup className="w-full">
                <InputGroupInput
                  ref={inputRef}
                  placeholder="Search for pages, features, or sections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-16"
                />
                <InputGroupAddon>
                  <SearchIcon className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Kbd>/</Kbd>
                </InputGroupAddon>
              </InputGroup>

              {/* Search Results */}
              {query && (
                <Card className="absolute top-full right-0 left-0 z-50 mt-2 py-0 backdrop-blur-sm">
                  <CardContent className="p-2">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-400">
                        Searching...
                      </div>
                    ) : results.length > 0 ? (
                      <ScrollArea className="h-64">
                        <div className="space-y-1">
                          {results.map((result, index) => (
                            <button
                              key={result.path}
                              className={`w-full rounded-md p-3 text-left transition-colors ${
                                index === selectedIndex
                                  ? "bg-main-purple/20 border-main-purple/30 border"
                                  : "hover:bg-gray-700/50"
                              }`}
                              onClick={() => navigateToRoute(result.path)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-white">
                                    {result.label}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {result.path}
                                  </div>
                                  {result.description && (
                                    <div className="mt-1 text-xs text-gray-500">
                                      {result.description}
                                    </div>
                                  )}
                                </div>
                                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        No results found for &quot;{query}&quot;
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Link href="/">
                <Button variant="ekofy">
                  <HomeIcon className="h-4 w-4" />
                  <span className="text-main-white text-sm/relaxed">
                    Go to Homepage
                  </span>
                </Button>
              </Link>
            </div>

            <EmptyDescription className="text-sm">
              <div className="space-y-2">
                <p>
                  <strong>Tip:</strong> Use the search above or press{" "}
                  <Kbd>/</Kbd> to focus the search bar
                </p>
                <p>
                  Need help?{" "}
                  <a href="#" className="text-main-purple hover:underline">
                    Contact support
                  </a>
                </p>
              </div>
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
};

export default Page;
