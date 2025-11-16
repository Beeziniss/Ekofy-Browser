import { graphql } from "@/gql";

export const CREATE_REQUEST_MUTATION = graphql(`
  mutation CreatePublicRequest($request: RequestCreatingRequestInput!) {
    createPublicRequest(request: $request)
  }
`);

export const UPDATE_REQUEST_MUTATION = graphql(`
  mutation UpdatePublicRequest($request: RequestUpdatingRequestInput!) {
    updatePublicRequest(request: $request)
  }
`);

export const BLOCK_REQUEST_MUTATION = graphql(`
  mutation BlockPublicRequest($requestId: String!) {
    blockPublicRequest(requestId: $requestId)
  }
`);

export const CHANGE_REQUEST_STATUS_MUTATION = graphql(`
  mutation ChangeRequestStatus($request: ChangeStatusRequestInput!) {
    changeRequestStatus(request: $request)
  }
`);

