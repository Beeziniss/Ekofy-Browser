"use client";

import { useQuery } from "@tanstack/react-query";
import { artistInvoicesOptions } from "@/gql/options/artist-activity-options";

export function useArtistInvoices(params: { userId: string; page: number; pageSize?: number }) {
  const { userId, page, pageSize = 10 } = params;
  return useQuery({
    ...artistInvoicesOptions({ userId, page, pageSize }),
  });
}
