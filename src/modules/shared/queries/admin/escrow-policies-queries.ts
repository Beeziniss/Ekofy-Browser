import { graphql } from "@/gql";

export const EXCROW_COMMISSION_POLICIES = graphql(`
query EscrowCommissionPolicies ($skip: Int, $take: Int, $where: EscrowCommissionPolicyFilterInput) {
    escrowCommissionPolicies(skip: $skip, take: $take, where: $where, order: { createdAt: DESC }) {
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            currency
            platformFeePercentage
            version
            status
            createdAt
            updatedAt
        }
    }
}
`);