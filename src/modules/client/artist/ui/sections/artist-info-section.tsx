import { ArtistDetailQuery } from "@/gql/graphql";

interface ArtistInfoSectionProps {
  followerCount: number;
  followingCount: number;
  artistData: ArtistDetailQuery;
}

const ArtistInfoSection = ({
  followerCount,
  followingCount,
  artistData,
}: ArtistInfoSectionProps) => {
  return (
    <div>
      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-y-2">
          <div className="text-main-white text-sm font-semibold">Followers</div>
          <div className="text-main-white text-4xl font-semibold">
            {followerCount}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="text-main-white text-sm font-semibold">Following</div>
          <div className="text-main-white text-4xl font-semibold">
            {followingCount}
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-2">
          <div className="text-main-white text-sm font-semibold">Tracks</div>
          <div className="text-main-white text-4xl font-semibold">
            {followingCount}
          </div>
        </div>
      </div>

      <div className="mt-6 text-lg">
        {artistData.artists?.items?.[0].biography || "No biography available."}
      </div>
    </div>
  );
};

export default ArtistInfoSection;
