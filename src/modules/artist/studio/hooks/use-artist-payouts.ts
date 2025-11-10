"use client";

import { useQuery } from "@tanstack/react-query";
import { artistPayoutsOptions } from "@/gql/options/artist-activity-options";

export function useArtistPayouts(params: { userId: string; page: number; pageSize?: number }) {
  const { userId, page, pageSize = 10 } = params;
  return useQuery({
    ...artistPayoutsOptions({ userId, page, pageSize }),
  });
}
