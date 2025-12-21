import { graphql } from "@/gql";

export const ENTITLEMENTS_QUERIES = graphql(`
    query EntitlementsList ($skip: Int, $take: Int, $where: EntitlementFilterInput, $order: [EntitlementSortInput!]){
        entitlements(skip: $skip, take: $take, where: $where, order: $order) {
            totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            name
            code
            description
            valueType
            isActive
            expiredAt
            createdAt
            updatedAt
            defaultValues {
                role
            }
            subscriptionOverrides {
                subscriptionCode
            }
        }
    }
}
`);

export const SubscriptionOverridesQuery = graphql(`
    query SubscriptionOverrides {
        subscriptions (where: { status: { eq: ACTIVE } }){
            items {
            id
            code
        }
    }
}
`);