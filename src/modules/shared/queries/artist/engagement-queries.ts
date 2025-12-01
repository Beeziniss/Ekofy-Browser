import { graphql } from "@/gql";

export const EngagementQuery = graphql(`
  query Engagement($where: TrackFilterInput, $takeTracks: Int) {
    userEngagement(where: { action: { eq: LIKE }, targetType: { eq: TRACK } }) {
      totalCount
      items {
        id
        actorId
        targetId
        tracks(where: $where, take: $takeTracks, order: { createdAt: DESC }) {
          items {
            favoriteCount
            streamCount
          }
        }
      }
    }
  }
`);
