import { graphql } from "@/gql";

export const NotificationQuery = graphql(`
  query Notification($where: NotificationFilterInput, $first: Int, $after: String) {
    notifications(where: $where, first: $first, after: $after, order: { createdAt: DESC }) {
      edges {
        cursor
        node {
          id
          createdAt
          content
          relatedType
          url
          isRead
          readAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);
