import { graphql } from "@/gql";

export const CouponListQuery = graphql(`
  query CouponList($skip: Int, $take: Int, $where: CouponFilterInput, $order: [CouponSortInput!]) {
    coupons(skip: $skip, take: $take, where: $where, order: $order) {
        totalCount
        pageInfo {
        hasNextPage
        hasPreviousPage
        }
        items {
        id
        stripeCouponId
        name
        description
        code
        percentOff
        duration
        purpose
        status
        createdAt
        updatedAt
        }
    }
  }
`);

