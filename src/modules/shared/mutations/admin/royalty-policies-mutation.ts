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

export const DOWN_GRADE_ROYALTY_POLICY_VERSION = graphql(`
    mutation DowngradeRoyaltyPolicyVersion ($version: Long) {
        downgradeRoyaltyPolicyVersion (version: $version) 
}
`);

export const SWITCH_TO_LASTEST_VERSION = graphql(`
    mutation SwitchToLatestVersion {
    switchToLatestVersion
}
`);