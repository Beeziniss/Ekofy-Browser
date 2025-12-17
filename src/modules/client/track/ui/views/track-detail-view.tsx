"use client";

import TrackSection from "../sections/track-section";
import TrackLikeSection from "../sections/track-like-section";
import TrackOwnerSection from "../sections/track-owner-section";
import RecommendedTracksSection from "../sections/track-recommended-section";
import TrackCommentSection from "../sections/track-comment-section";
import TrackRelatedSection from "../sections/track-related-section";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackDetailOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  return (
    <Suspense fallback={<TrackDetailViewSkeleton />}>
      <TrackDetailViewContent trackId={trackId} />
    </Suspense>
  );
};

const TrackDetailViewSkeleton = () => {
  return (
    <div className={"w-full"}>
      <div className={"flex w-full gap-x-8 p-8"}>
        <Skeleton className={"size-70 shrink-0 rounded-md"} />

        <div className={"flex flex-1 flex-col gap-y-4"}>
          <div className={"flex flex-col gap-y-2"}>
            <Skeleton className={"h-10 w-1/3 rounded-full"} />
            <Skeleton className={"h-6 w-1/4 rounded-full"} />
            <div className={"mt-auto flex items-center gap-x-4"}>
              <Skeleton className={"h-6 w-20 rounded-full"} />
            </div>
          </div>

          <Skeleton className={"mt-auto size-16 rounded-full"} />
        </div>
      </div>

      <div className="grid w-full grid-cols-12 gap-8 px-8">
        <div className="col-span-9 space-y-8">
          <Skeleton className="h-64 w-full rounded-md" />
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
        <div className="col-span-3 space-y-8">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
};

const TrackDetailViewContent = ({ trackId }: TrackDetailViewProps) => {
  const { user } = useAuthStore();
  const { data } = useSuspenseQuery(trackDetailOptions(trackId));

  const trackDetail = data.tracks?.items?.[0];
  const isPublic = trackDetail?.releaseInfo?.isRelease ?? true;
  const createdBy = trackDetail?.createdBy;
  const currentUserId = user?.userId;

  // Access control: If track is private (isRelease = false), only allow access to the creator
  if (!isPublic && createdBy !== currentUserId) {
    redirect("/unauthorized");
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8">
        <TrackSection trackId={trackId} />

        <div className="grid w-full grid-cols-12 gap-8 px-8">
          <div className="col-span-9 space-y-8">
            <TrackOwnerSection trackId={trackId} />
            <TrackCommentSection trackId={trackId} />
          </div>
          <div className="col-span-3 space-y-8">
            <RecommendedTracksSection trackId={trackId} />
            <TrackRelatedSection trackId={trackId} />
            <TrackLikeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailView;
