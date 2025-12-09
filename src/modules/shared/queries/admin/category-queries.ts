import { graphql } from "@/gql";

export const CATEGORY_QUERIES = graphql(`
    query CategoriesAdmin($skip: Int, $take: Int, $where: CategoryFilterInput, $order: [CategorySortInput!]) {
    categories(skip: $skip, take: $take, where: $where, order: $order) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            name
            slug
            type
            aliases
            popularity
            description
            isVisible
            createdAt
            updatedAt
        }
    }
}
`);

export const CATEGORY_QUERIES_DETAIL = graphql(`
    query CategoryDetailAdmin($where: CategoryFilterInput) { 
    categories(where: $where) {
        items {
                id
                name
                slug
                type
                aliases
                popularity
                description
                isVisible
                createdAt
                updatedAt
            }
        }
    }
`);  