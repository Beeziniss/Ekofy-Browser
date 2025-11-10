import { graphql } from "@/gql";

export const stripeMutation = graphql(`
    mutation CreateExpressConnectedAccount ($returnUrl: String!, $refreshUrl: String!) {
        createExpressConnectedAccount (returnUrl: $returnUrl, refreshUrl: $refreshUrl) {
            url
        }
    }
`);