import { graphql } from "@/gql";

export const CREATE_ROYALTY_POLICY = graphql(`
    mutation createRoyaltyPolicy ($createRoyalPolicyRequest: CreateRoyalPolicyRequestInput!) {
        createRoyaltyPolicy (createRoyalPolicyRequest: $createRoyalPolicyRequest) 
}
`);

export const UPDATE_ROYALTY_POLICY = graphql(`
    mutation updateRoyaltyPolicy ($updateRoyalPolicyRequest: UpdateRoyalPolicyRequestInput!) {
        updateRoyaltyPolicy (updateRoyalPolicyRequest: $updateRoyalPolicyRequest) 
}
`);