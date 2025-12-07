import { graphql } from "@/gql";

export const REFUND_PARTIALLY_MUTATION = graphql(`
  mutation RefundPartially($request: PackageOrderRefundRequestInput!) {
    refundPartially(request: $request)
}
`);

export const SWITCH_STATUS_BY_REQUESTOR_MUTATION = graphql(`
  mutation SwitchStatusByRequestor($request: ChangeOrderStatusRequestInput!) {
    switchStatusByRequestor(request: $request)
  }
`);