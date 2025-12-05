import { graphql } from "@/gql";

export const REFUND_PARTIALLY_MUTATION = graphql(`
  mutation RefundPartially($request: PackageOrderRefundRequestInput!) {
    refundPartially(request: $request)
}
`);