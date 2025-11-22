import { graphql } from "@/gql";

export const AddConversationGeneralMutation = graphql(`
  mutation AddConversationGeneral($otherUserId: String!) {
    addConversationGeneral(otherUserId: $otherUserId)
  }
`);

export const AddConversationFromRequestHubMutation = graphql(`
  mutation AddConversationFromRequestHub($createConversationRequestInput: CreateConversationRequestInput!) {
    addConversationFromRequestHub(request: $createConversationRequestInput)
  }
`);
