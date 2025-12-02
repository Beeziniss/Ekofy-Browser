import { graphql } from "@/gql";

export const ROYALTY_POLICIES_QUERY = graphql(`
    query RoyaltyPolicies ($skip: Int, $take: Int, $where: RoyaltyPolicyFilterInput) {
        royaltyPolicies (skip: $skip, take: $take, where: $where, order: { createdAt: DESC }) {
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            ratePerStream
            currency
            recordingPercentage
            workPercentage
            version
            status
            createdAt
            updatedAt
        }
        totalCount
    }
}`);