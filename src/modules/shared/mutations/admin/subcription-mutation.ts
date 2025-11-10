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

export const ACTIVATE_SUBSCRIPTION = graphql(`
  mutation ActivateSubscription($subscriptionId: String!) {
    activateSubscription(subscriptionId: $subscriptionId)
  }
`);

export const UPDATE_SUBSCRIPTION_PLAN = graphql(`
  mutation UpdateSubscriptionPlan($updateSubscriptionPlanRequest: UpdateSubscriptionPlanRequestInput!) {
    updateSubscriptionPlan(updateSubscriptionPlanRequest: $updateSubscriptionPlanRequest)
  }
`);