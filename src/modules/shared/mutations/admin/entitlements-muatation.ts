import { graphql } from "@/gql";

export const CREATE_ENTITLEMENT = graphql(`
    mutation CreateEntitlement($createEntitlementRequest: CreateEntitlementRequestInput!) {
        createEntitlement(createEntitlementRequest: $createEntitlementRequest)
    }
`);

export const DEACTIVATE_ENTITLEMENT = graphql(`
    mutation DeactivateEntitlement($code: String!) {
        deactiveEntitlement(code: $code)
    }
`);

export const REACTIVATE_ENTITLEMENT = graphql(`
    mutation ReactivateEntitlement($code: String!) {
        reactiveEntitlement(code: $code)
    }
`);