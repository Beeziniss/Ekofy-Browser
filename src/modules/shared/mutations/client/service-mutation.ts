import { graphql } from "@/gql";

export const ServiceCreateCheckoutSessionMutation = graphql(`
  mutation ServiceCreateCheckoutSession($createPaymentCheckoutSessionInput: CreatePaymentCheckoutSessionRequestInput!) {
    createPaymentCheckoutSession(createPaymentCheckoutSessionRequest: $createPaymentCheckoutSessionInput) {
      id
      url
    }
  }
`);
