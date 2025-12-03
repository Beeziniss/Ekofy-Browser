import { graphql } from "@/gql";

export const CREATE_ESCOMMISSION_POLICY = graphql(`
mutation CreateEscrowCommissionPolicy($createRequest: CreateEscrowCommissionPolicyRequestInput!) {
    createEscrowCommissionPolicy(createRequest: $createRequest)
}
`);

export const DOWN_GRADE_ESCROW_COMMISSION_POLICY_VERSION = graphql(`
mutation DowngradeEscrowCommissionPolicyVersion($version: Long) {
    downgradeEscrowCommissionPolicyVersion(version: $version)
}
`);

export const SWITCH_ESCROW_COMMISSION_POLICY_TO_LATEST_VERSION = graphql(`
mutation SwitchEscrowCommissionPolicyToLatestVersion {
    switchEscrowCommissionPolicyToLatestVersion
}
`);