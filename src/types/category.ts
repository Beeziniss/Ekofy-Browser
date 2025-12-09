import { CategoriesAdminQuery } from "@/gql/graphql";

// Extract Category type from GraphQL query response
export type Category = NonNullable<
  NonNullable<CategoriesAdminQuery["categories"]>["items"]
>[number];

// Response type for categories list
export interface CategoriesResponse {
  categories: {
    items: Category[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Input type for creating a category
export interface CreateCategoryRequestInput {
  name: string;
  slug?: string;
  type: string;
  aliases?: string[];
  description?: string;
  isVisible?: boolean;
}

// Input type for updating a category
export interface UpdateCategoryRequestInput {
  id: string;
  name?: string;
  slug?: string;
  type?: string;
  aliases?: string[];
  description?: string;
  isVisible?: boolean;
}

// Filter input for category queries
export interface CategoryFilters {
  searchTerm?: string;
  type?: string;
  isVisible?: boolean;
}
