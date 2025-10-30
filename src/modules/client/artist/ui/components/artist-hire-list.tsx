import React from "react";
import ArtistHireCard from "./artist-hire-card";
import { InfiniteData } from "@tanstack/react-query";
import { ArtistListQuery } from "@/gql/graphql";

interface ArtistHireListProps {
  data: InfiniteData<ArtistListQuery>;
  isPending: boolean;
}

const ArtistHireList = ({ data, isPending }: ArtistHireListProps) => {
  const allArtists = data.pages.flatMap((page) => page.artists?.items || []);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, idx) => (
          <ArtistHireCard key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {allArtists.map((artist, idx) => (
        <ArtistHireCard key={artist.userId || idx} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistHireList;
