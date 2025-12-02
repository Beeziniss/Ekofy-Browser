import { graphql } from "@/gql";

export const TrackEngagementQuery = graphql(`
  query TrackEngagement($whereEngaement: UserEngagementFilterInput, $take: Int) {
    userEngagement(where: $whereEngaement, take: $take) {
      totalCount
      items {
        id
        actorId
        targetId
        targetType
        action
        actorType
        createdAt
      }
    }
  }
`);

export const TrackEngagementFavCountQuery = graphql(`
  query TrackEngagementFavCount($whereEngaement: UserEngagementFilterInput) {
    userEngagement(where: $whereEngaement) {
      totalCount
    }
  }
`);
