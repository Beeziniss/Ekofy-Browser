import { graphql } from "@/gql";

export const CREATE_COUPON_MUTATION = graphql(`
    mutation CreateCoupon($createCouponRequest: CreateCouponRequestInput!) {
        createCoupon(createCouponRequest: $createCouponRequest)
    }
`);

export const DEPRECATE_COUPON = graphql (`
    mutation DeprecateCoupon($couponIds: [String!]!) {
        deprecateCoupon(couponIds: $couponIds)
    }
`);