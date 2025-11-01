"use client";

import { artistOptions } from "@/gql/options/client-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import ArtistAvatarSection from "../sections/artist-avatar-section";
import ArtistOptionsSection from "../sections/artist-options-section";

interface ArtistDetailViewProps {
  artistId: string;
}

const ArtistDetailView = ({ artistId }: ArtistDetailViewProps) => {
  const { data } = useSuspenseQuery(artistOptions(artistId));

  return (
    <div className="w-full">
      <ArtistAvatarSection artistData={data} />
      <ArtistOptionsSection />
    </div>
  );
};

export default ArtistDetailView;
