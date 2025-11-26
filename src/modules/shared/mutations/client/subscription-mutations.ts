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

export const SubscriptionCancelMutation = graphql(`
  mutation CancelSubscriptionAtPeriodEnd {
    cancelSubscriptionAtPeriodEnd
  }
`);

export const SubscriptionResumeMutation = graphql(`
  mutation ResumeSubscription {
    resumeSubscription
  }
`);
