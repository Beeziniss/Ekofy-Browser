import { graphql } from "@/gql";

export const updateFingerprintConfidencePolicyMutation = graphql(`
    mutation UpdateFingerprintConfidencePolicy($updateRequest: UpdateFingerprintConfidencePolicyRequestInput!) {
        updateFingerprintConfidencePolicy(updateRequest: $updateRequest)
    }
`);