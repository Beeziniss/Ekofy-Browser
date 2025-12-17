import { mutationOptions } from "@tanstack/react-query";
import { execute } from "../execute";
import { ComputePlatformTransactions } from "@/modules/shared/mutations/admin/dashboard-admin-mutation";
import { ComputeArtistRevenueByArtistId } from "@/modules/shared/mutations/artist/dashboard-artist-mutation";

/**
 * Mutation options for computing platform revenue (Admin only)
 * Calculates subscription revenue, service revenue, payouts, refunds, and profit
 */
export const computePlatformRevenueMutation = () =>
  mutationOptions({
    mutationKey: ["compute-platform-revenue"],
    mutationFn: async () => {
      const result = await execute(ComputePlatformTransactions);
      return result.computePlatformRevenue;
    },
  });

/**
 * Mutation options for computing artist revenue by artist ID
 * @param artistId - The ID of the artist to compute revenue for
 */
export const computeArtistRevenueMutation = () =>
  mutationOptions({
    mutationKey: ["compute-artist-revenue"],
    mutationFn: async (artistId: string) => {
      const result = await execute(ComputeArtistRevenueByArtistId, { artistId });
      return result.computeArtistRevenueByArtistId;
    },
  });
