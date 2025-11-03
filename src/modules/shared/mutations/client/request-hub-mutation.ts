import { graphql } from "@/gql";

export const CREATE_REQUEST_MUTATION = graphql(`
    mutation CreateRequest($request: RequestCreatingRequestInput!) {
        createRequest(request: $request)
    }
`);

export const UPDATE_REQUEST_MUTATION = graphql(`
    mutation UpdateRequest($request: RequestUpdatingRequestInput!) {
        updateRequest(request: $request)
    }
`);

export const BLOCK_REQUEST_MUTATION = graphql(`
    mutation BlockRequest($requestId: String!) {
        blockRequest(requestId: $requestId)
    }
`);
