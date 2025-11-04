import { SubscriptionStatus, SubscriptionTier, PeriodTime } from "@/gql/graphql";

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  code: string;
  version: number;
  amount: number;
  currency: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionPlanPrice {
  stripePriceId: string;
  stripePriceActive: boolean;
  stripePriceUnitAmount: number;
  stripePriceCurrency: string;
  stripePriceLookupKey: string;
  interval: PeriodTime;
  intervalCount: number;
}

export interface SubscriptionPlan {
  id: string;
  subscriptionId: string;
  stripeProductId: string;
  stripeProductActive: boolean;
  stripeProductName: string;
  stripeProductImages: string[];
  stripeProductType: string;
  stripeProductMetadata: Array<{
    key: string;
    value: string;
  }>;
  subscriptionPlanPrices: SubscriptionPlanPrice[];
  subscription: Subscription[];
}

export interface SubscriptionsResponse {
  subscriptions: {
    items: Subscription[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    totalCount: number;
  };
}

export interface SubscriptionPlansResponse {
  subscriptionPlans: {
    items: SubscriptionPlan[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    totalCount: number;
  };
}

export interface CreateSubscriptionInput {
  name: string;
  description?: string;
  code: string;
  version: number;
  price: number;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
}

export interface UpdateSubscriptionInput {
  id: string;
  name?: string;
  description?: string;
  code?: string;
  version?: number;
  price?: number;
  tier?: SubscriptionTier;
  status?: SubscriptionStatus;
}

export interface CreateSubscriptionPlanInput {
  name: string;
  subscriptionCode: string;
  images?: string[];
  metadata?: Array<{
    key: string;
    value: string;
  }>;
  prices: Array<{
    interval: PeriodTime;
    intervalCount: number;
    lookupKey: string;
  }>;
}

// GraphQL type for the actual API call
export interface CreateSubScriptionPlanRequestInput {
  name: string;
  subscriptionCode: string;
  images?: string[];
  metadata?: Array<{
    key: string;
    value: string;
  }>;
  prices: Array<{
    interval: PeriodTime;
    intervalCount: number;
    lookupKey: string;
  }>;
}

export interface UpdateSubscriptionPlanInput {
  id: string;
  stripeProductActive?: boolean;
  stripeProductName?: string;
  stripeProductImages?: string[];
  stripeProductMetadata?: Array<{
    key: string;
    value: string;
  }>;
}