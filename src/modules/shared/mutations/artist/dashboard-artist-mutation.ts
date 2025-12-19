import { graphql } from "@/gql";

export const ComputeArtistRevenueByArtistId = graphql(`
    mutation ComputeArtistRevenueByArtistId($artistId: String!) {
        computeArtistRevenueByArtistId(artistId: $artistId) {
            royaltyEarnings
            serviceRevenue
            serviceEarnings
            grossRevenue
            netRevenue
        }
    }
`);