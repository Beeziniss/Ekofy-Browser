"use client";

import { artistDetailOptions, followerOptions, followingOptions } from "@/gql/options/client-options";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ArtistAvatarSection from "../sections/artist-avatar-section";
import ArtistOptionsSection from "../sections/artist-options-section";
import ArtistInfoSection from "../sections/artist-info-section";
import { Suspense } from "react";

interface ArtistDetailLayoutProps {
  children: React.ReactNode;
}

const ArtistDetailLayout = ({ children }: ArtistDetailLayoutProps) => {
  const { artistId } = useParams<{ artistId: string }>();

  const results = useSuspenseQueries({
    queries: [artistDetailOptions(artistId), followerOptions({ artistId }), followingOptions({ artistId })],
  });

  const [{ data: artistData }, { data: followerData }, { data: followingData }] = results;

  return (
    <div className="w-full pb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <ArtistAvatarSection artistData={artistData} />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <ArtistOptionsSection artistData={artistData} artistId={artistId} />
      </Suspense>

      <div className="grid grid-cols-8 gap-x-4 px-6">
        <div className="col-span-6 w-full">{children}</div>
        <div className="col-span-2 w-full">
          <div className="bg-main-purple/20 sticky top-20 rounded-md p-4 shadow">
            <ArtistInfoSection
              artistData={artistData}
              followerCount={followerData?.followers?.totalCount ?? 0}
              followingCount={followingData?.followings?.totalCount ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailLayout;
