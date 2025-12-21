"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackListHomeOptions } from "@/gql/options/client-options";
import TrackCarousel from "@/modules/client/common/ui/components/track/track-carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NewReleasesSection = () => {
  return (
    <Suspense fallback={<NewReleasesSkeleton />}>
      <NewReleasesSectionSuspense />
    </Suspense>
  );
};

const NewReleasesSkeleton = () => {
  return (
    <div className="w-full space-y-6 px-4">
      <div className="text-2xl font-semibold">New releases for you</div>
      <TrackCarousel data={{}} isLoading />
    </div>
  );
};

const NewReleasesSectionSuspense = () => {
  const { data, isPending } = useSuspenseQuery(trackListHomeOptions);

  return (
    <div className="w-full space-y-6 px-4">
      <div className="flex items-center gap-x-3 text-2xl font-semibold">
        <span>New releases for you</span>
        <Link href={"/all/tracks"}>
          <Button variant={"outline"} size={"sm"}>
            View All
          </Button>
        </Link>
      </div>
      <TrackCarousel data={data} isLoading={isPending} />
    </div>
  );
};

export default NewReleasesSection;
