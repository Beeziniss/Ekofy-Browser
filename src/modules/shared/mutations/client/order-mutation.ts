import { graphql } from "@/gql";

export const SubmitDeliveryMutation = graphql(`
  mutation SubmitDelivery($request: SubmitDeliveryRequestInput!) {
    submitDelivery(request: $request)
  }
`);

export const ApproveDeliveryMutation = graphql(`
  mutation ApproveDelivery($packageOrderId: String!) {
    approveDelivery(packageOrderId: $packageOrderId)
  }
`);

export const SendRedoRequestMutation = graphql(`
  mutation SendRedoRequest($request: RedoRequestInput!) {
    sendRedoRequest(request: $request)
  }
`);

export const AcceptRequestByArtistMutation = graphql(`
  mutation AcceptRequestByArtist($packageOrderId: String!) {
    acceptRequestByArtist(packageOrderId: $packageOrderId)
  }
`);

export const SwitchStatusByRequestorMutation = graphql(`
  mutation SwitchStatusByRequestor($request: ChangeOrderStatusRequestInput!) {
    switchStatusByRequestor(request: $request)
  }
`);
