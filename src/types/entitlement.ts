import { EntitlementsListQuery } from "@/gql/graphql";

// Extract Entitlement type from GraphQL query response
export type Entitlement = NonNullable<
  NonNullable<EntitlementsListQuery["entitlements"]>["items"]
>[number];

// Response type for entitlements list
export interface EntitlementsResponse {
  entitlements: {
    items: Entitlement[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Filter input for entitlement queries
export interface EntitlementFilters {
  searchTerm?: string;
  isActive?: boolean;
  valueType?: string;
}

