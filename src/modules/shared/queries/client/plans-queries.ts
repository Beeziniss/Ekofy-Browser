import { graphql } from "@/gql";

export const COUPON_QUERIES = graphql(`
query Coupons ($where: CouponFilterInput) {
    coupons(where: $where) {
        items {
            percentOff
            id
            name
        }
    }
}
`);

export const ENTITLEMENT_QUERIES = graphql(`
query Entitlements ($where: EntitlementFilterInput) {
    entitlements(where: $where) {
         items {
            id
            name
            subscriptionOverrides {
                subscriptionCode
            }
            isActive
        }
    }
}
`);