import { graphql } from "@/gql";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import TrackInsightInfoSection from "../sections/track-insight-info-section";

interface TrackInsightViewProps {
  trackId: string;
}

export const TrackInsightViewQuery = graphql(`
  query TrackInsightView($trackId: String!) {
    tracks(where: { id: { eq: $trackId } }) {
      items {
        id
        name
        coverImage
        releaseInfo {
          releaseDate
        }
        streamCount
        favoriteCount
      }
    }
  }
`);

const TrackInsightView = ({ trackId }: TrackInsightViewProps) => {
  return (
    <div className="w-full space-y-6 px-4 py-8">
      <Link
        href="/artist/studio/tracks"
        className="text-main-white hover:text-main-purple group border-b-main-white hover:border-b-main-purple flex w-fit items-center gap-x-2 border-b text-sm"
      >
        <ArrowLeftIcon className="text-main-white group-hover:text-main-purple size-4" />
        Back to Tracks
      </Link>

      <TrackInsightInfoSection trackId={trackId} />
    </div>
  );
};

export default TrackInsightView;
