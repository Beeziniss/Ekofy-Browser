import { graphql } from "@/gql";

export const SendRequestMutation = graphql(`
  mutation SendRequest($request: CreateDirectRequestInput!, $isDirect: Boolean!) {
    sendRequest(request: $request, isDirectRequest: $isDirect)
  }
`);
