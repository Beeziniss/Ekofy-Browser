"use client";

import { useQuery } from "@tanstack/react-query";
import { artistProfileOptions } from "@/gql/options/artist-options";
import { useAuthStore } from "@/store";
import { format } from "date-fns";
import { ArtistType } from "@/types/artist_type";
import { userActiveSubscriptionOptions } from "@/gql/options/client-options";

export function useArtistProfile() {
  const { user, isAuthenticated } = useAuthStore();
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

  // Membership status from active subscription, fallback to verification heuristic
  const subscriptionQuery = useQuery({
    ...userActiveSubscriptionOptions(userId),
    retry: 0,
    enabled: !!userId && !!isAuthenticated,
  }) as {
    data: {
      isActive?: boolean;
      subscription?: { tier?: string };
    } | null;
    isError?: boolean;
  };

  const membershipStatus =
    (subscriptionQuery?.data?.isActive && subscriptionQuery.data.subscription?.tier) ||
    (query.data?.isVerified ? "PREMIUM" : "FREE");

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
    userStatus: query.data?.user?.status,
    membershipStatus,
  };
}
