import { graphql } from "@/gql";

export const BLOCK_PUBLIC_REQUEST_MUTATION = graphql(`
  mutation BlockPublicRequest($requestId: String!) {
    blockPublicRequest(requestId: $requestId)
  }
`);