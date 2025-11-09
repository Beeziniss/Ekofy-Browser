import { graphql } from "@/gql";

export const SubscriptionCreateCheckoutSessionMutation = graphql(`
  mutation SubscriptionCreateCheckoutSession(
    $createSubscriptionCheckoutSessionInput: CreateSubscriptionCheckoutSessionRequestInput!
  ) {
    createSubscriptionCheckoutSession(createCheckoutSessionRequest: $createSubscriptionCheckoutSessionInput) {
      id
      url
    }
  }
`);
