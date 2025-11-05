import { graphql } from "@/gql";

export const CREATE_SUBSCRIPTION = graphql(`
  mutation CreateSubscription($createSubscriptionRequest: CreateSubscriptionRequestInput!) {
    createSubscription(createSubscriptionRequest: $createSubscriptionRequest)
    }
`);

export const CREATE_SUBSCRIPTION_PLAN = graphql(`
  mutation CreateSubscriptionPlan($createSubScriptionPlanRequest: CreateSubScriptionPlanRequestInput!) {
    createSubscriptionPlan(createSubScriptionPlanRequest: $createSubScriptionPlanRequest)
    }
`);