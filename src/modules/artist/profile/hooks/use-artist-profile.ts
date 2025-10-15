"use client";

import { useQuery } from "@tanstack/react-query";
import { artistProfileOptions } from "@/gql/options/artist-options";
import { useAuthStore } from "@/store";
import { format } from "date-fns";
import { ArtistType } from "@/types/artist_type";

export function useArtistProfile() {
  const { user } = useAuthStore();
  const userId = user?.userId || "";
  const query = useQuery(artistProfileOptions(userId));

  // Prefer showing the artist's stage name in the header; avoid mixing with email/display name
  const name = query.data?.stageName || "Artist";
  const avatarUrl = query.data?.avatarImage || "";
  const backgroundUrl = query.data?.bannerImage || "/image-login.png";

  const createdAt = query.data?.createdAt
    ? (() => {
        try {
          return format(new Date(query.data!.createdAt), "yyyy-MM-dd");
        } catch {
          return undefined;
        }
      })()
    : undefined;

  const isSolo = query.data?.artistType === ArtistType.Individual;

  return {
    ...query,
    header: {
      name,
      avatarUrl,
      backgroundUrl,
    },
    biography: query.data?.biography || "",
    members: query.data?.members || [],
    isVerified: !!query.data?.isVerified,
    createdAt,
    artistType: query.data?.artistType,
    identityCard: query.data?.identityCard,
    isSolo,
  };
}
