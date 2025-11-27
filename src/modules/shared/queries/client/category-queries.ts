import { graphql } from "@/gql";

export const CategoriesChannelQuery = graphql(`
  query CategoriesChannel($type: CategoryType, $take: Int!) {
    categories(where: { isVisible: { eq: true }, type: { eq: $type } }, order: { popularity: DESC }, take: $take) {
      items {
        id
        name
      }
    }
  }
`);
