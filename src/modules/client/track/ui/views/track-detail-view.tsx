"use client";

import TrackSection from "../sections/track-section";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  artistOptions,
  listenerOptions,
  trackDetailOptions,
} from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import TrackLikeSection from "../sections/track-like-section";
import TrackOwnerSection from "../sections/track-owner-section";
import TrackRelatedSection from "../sections/track-related-section";
import TrackCommentSection from "../sections/track-comment-section";

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  const { user } = useAuthStore();
  const { data } = useSuspenseQuery(trackDetailOptions(trackId));

  const { data: artistData } = useQuery(
    artistOptions(user?.userId || "", user?.artistId || ""),
  );
  const { data: listenerData } = useQuery(
    listenerOptions(user?.userId || "", user?.listenerId || ""),
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8">
        <TrackSection trackId={trackId} data={data} />

        <div className="grid w-full grid-cols-12 gap-8 px-8">
          <div className="col-span-9 space-y-8">
            <TrackOwnerSection data={data} artistData={artistData} />
            <TrackCommentSection
              trackId={trackId}
              listenerData={listenerData}
              artistData={artistData}
            />
          </div>
          <div className="col-span-3 space-y-8">
            <TrackRelatedSection />
            <TrackLikeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailView;
