import { Suspense } from "react";
import { ArtistDetailQuery } from "@/gql/graphql";

interface ArtistInfoSectionProps {
  artistData: ArtistDetailQuery;
  followerCount: number;
  followingCount: number;
}

const ArtistInfoSection = ({ artistData, followerCount, followingCount }: ArtistInfoSectionProps) => {
  const artist = artistData.artists?.items?.[0];

  return (
    <Suspense fallback={<div>Loading artist info...</div>}>
      <div>
        <div className="grid grid-cols-3">
          <div className="flex flex-col gap-y-2">
            <div className="text-main-white text-sm font-semibold">Followers</div>
            <div className="text-main-white text-4xl font-semibold">{followerCount}</div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="text-main-white text-sm font-semibold">Following</div>
            <div className="text-main-white text-4xl font-semibold">{followingCount}</div>
          </div>
          <div className="flex flex-col items-end gap-y-2">
            <div className="text-main-white text-sm font-semibold">Tracks</div>
            <div className="text-main-white text-4xl font-semibold">{followingCount}</div>
          </div>
        </div>

        <div className="mt-6 text-lg">{artist?.biography || "No biography available."}</div>
      </div>
    </Suspense>
  );
};

export default ArtistInfoSection;
