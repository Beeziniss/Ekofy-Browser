import { graphql } from "@/gql";

export const CategoriesQuery = graphql(`
  query Categories($skip: Int, $take: Int) {
    categories(skip: $skip, take: $take, where: { isVisible: { eq: true } }) {
      items {
        id
        name
      }
    }
  }
`);
