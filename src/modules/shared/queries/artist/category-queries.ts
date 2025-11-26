import { graphql } from "@/gql";

export const CategoriesQuery = graphql(`
  query Categories {
    categories {
      items {
        id
        name
      }
    }
  }
`);
