import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const observerOptions = useMemo(
    () => ({
      threshold: 0.5,
      rootMargin: "100px",
    }),
    [],
  );

  const { targetRef, isIntersecting } =
    useIntersectionObserver(observerOptions);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isIntersecting,
    isManual,
  ]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        <Button
          variant={"secondary"}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : (
        <p className="text-muted-foreground text-sm">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
};

export default InfiniteScroll;
