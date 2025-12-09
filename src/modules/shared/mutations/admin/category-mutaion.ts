import { graphql } from "@/gql";

export const CREATE_CATEGORY_MUTATION = graphql(`
    mutation CreateCategory($categoryRequest: CreateCategoryRequestInput!) {
        createCategory(categoryRequest: $categoryRequest)
    }
`);

export const UPDATE_CATEGORY_MUTATION = graphql(`
    mutation UpdateCategory($updateCategoryRequest: UpdateCategoryRequestInput!) {
        updateCategory(updateCategoryRequest: $updateCategoryRequest)
    }
`);

export const SOFT_DELETE_CATEGORY_MUTATION = graphql(`
    mutation SoftDeleteCategory($categoryId: String!) {
        softDeleteCategory(categoryId: $categoryId)
    }
`);