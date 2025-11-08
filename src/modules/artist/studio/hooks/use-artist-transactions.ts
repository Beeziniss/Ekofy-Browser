"use client";

import { useQuery } from "@tanstack/react-query";
import { artistTransactionsOptions } from "@/gql/options/artist-activity-options";

export function useArtistTransactions(params: { userId: string; page: number; pageSize?: number }) {
  const { userId, page, pageSize = 10 } = params;
  return useQuery({
    ...artistTransactionsOptions({ userId, page, pageSize }),
  });
}
