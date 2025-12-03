"use client";

import { artistDetailOptions, followerOptions, followingOptions } from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ArtistAvatarSection from "../sections/artist-avatar-section";
import ArtistOptionsSection from "../sections/artist-options-section";
import ArtistInfoSection from "../sections/artist-info-section";

interface ArtistDetailLayoutProps {
  children: React.ReactNode;
}

const ArtistDetailLayout = ({ children }: ArtistDetailLayoutProps) => {
  const { artistId } = useParams<{ artistId: string }>();

  const { data } = useSuspenseQuery(artistDetailOptions(artistId));

  const { data: followerData } = useSuspenseQuery(followerOptions({ artistId }));
  const { data: followingData } = useSuspenseQuery(followingOptions({ artistId }));

  return (
    <div className="w-full pb-10">
      <ArtistAvatarSection artistData={data} />
      <ArtistOptionsSection artistData={data} artistId={artistId} />

      <div className="grid grid-cols-8 gap-x-4 px-6">
        <div className="col-span-6 w-full">{children}</div>
        <div className="col-span-2 w-full">
          <div className="bg-main-purple/20 sticky top-20 rounded-md p-4 shadow">
            <ArtistInfoSection
              followerCount={followerData?.followers?.totalCount ?? 0}
              followingCount={followingData?.followings?.totalCount ?? 0}
              artistData={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailLayout;
