"use client";

import { graphql } from "@/gql";
import TrackSection from "../sections/track-section";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trackDetailOptions } from "@/gql/options/client-options";
import TrackOwnerSection from "../sections/track-owner-section";
import TrackRelatedSection from "../sections/track-related-section";
import TrackCommentSection from "../sections/track-comment-section";
import TrackLikeSection from "../sections/track-like-section";

export const TrackDetailViewQuery = graphql(`
  query TrackDetail($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }) {
      items {
        id
        name
        coverImage
        favoriteCount
        streamCount
        mainArtistIds
        mainArtistsAsync {
          items {
            stageName
            followerCount
          }
        }
      }
    }
  }
`);

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  const { data } = useSuspenseQuery(trackDetailOptions(trackId));

  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8">
        <TrackSection trackId={trackId} data={data} />

        <div className="grid w-full grid-cols-12 gap-8 px-8">
          <div className="col-span-9 space-y-8">
            <TrackOwnerSection data={data} />
            <TrackCommentSection />
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
