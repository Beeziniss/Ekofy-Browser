import { graphql } from "@/gql";

export const SUBSCRIPTION_QUERIES = graphql(`
 query Subscriptions ($skip: Int, $take: Int, $where: SubscriptionFilterInput!) {
    subscriptions(skip: $skip, take: $take, where: $where) {
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            name
            description
            code
            status
            createdAt
            tier
            amount
        }
        totalCount
    }
}
`);

export const SUBSCRIPTION_DETAIL_QUERIES = graphql(`
query SubscriptionsDetail($where: SubscriptionFilterInput) {
    subscriptions(where: $where) {
        items {
            id
            name
            description
            code
            version
            amount
            currency
            tier
            status
            createdAt
            updatedAt
        }
    }
}
`);

export const SUBSCRIPTION_PLANS_QUERIES = graphql(`
query SubscriptionPlans($skip: Int, $take: Int, $where: SubscriptionPlanFilterInput) {
    subscriptionPlans(skip: $skip, take: $take, where: $where) {
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        items {
            id
            subscriptionId
            stripeProductId
            stripeProductActive
            stripeProductName
            stripeProductImages
            stripeProductType
            stripeProductMetadata {
                key
                value
            }
            subscriptionPlanPrices {
                stripePriceId
                stripePriceActive
                stripePriceUnitAmount
                stripePriceCurrency
                stripePriceLookupKey
                interval
                intervalCount
            }
            subscription {
                id
                name
                description
                code
                version
                amount
                currency
                tier
                status
                createdAt
                updatedAt
            }
        }
        totalCount
    }
}
`);
