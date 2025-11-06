"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  subscriptionsPremiumQueryOptions,
  subscriptionsProQueryOptions,
  premiumSubscriptionPlansQueryOptions,
  proSubscriptionPlansQueryOptions,
  listenerPremiumEntitlementsQueryOptions,
  artistProEntitlementsQueryOptions,
  availableCouponsQueryLISTENER10FOREVEROptions,
  availableCouponsQueryARTIST20FOREVEROptions,
} from "../../../../../gql/options/subscription-clients-options";
import { SubscriptionHeroSection } from "../sections/subscription-hero-section";
import { SubscriptionPlansGridSection } from "../sections/subscription-plans-grid-section";
import ClientLayout from "@/modules/client/common/ui/layouts/client-layout";
import { useAuthStore } from "@/store/stores/auth-store";
import { UserRole } from "@/types/role";
import type { SubscriptionPlan, Subscription, SubscriptionPlanPrice, GraphQLSubscriptionPlan } from "@/types";

// Transform GraphQL response to match our types
const transformPlans = (rawPlans: GraphQLSubscriptionPlan[]): SubscriptionPlan[] => {
  return rawPlans.map((plan) => ({
    ...plan,
    stripeProductImages: plan.stripeProductImages || [],
    stripeProductMetadata: plan.stripeProductMetadata || [],
    subscription: plan.subscription.map((sub) => ({
      ...sub,
      description: sub.description || undefined,
    })) as Subscription[],
    subscriptionPlanPrices: plan.subscriptionPlanPrices as SubscriptionPlanPrice[],
  }));
};

export function SubscriptionPlansPublicView() {
  const plansRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Determine user role (default to guest if not authenticated)
  const userRole = user?.role;
  const isArtist = userRole === UserRole.ARTIST;

  // Query for subscriptions based on user role
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery(
    isArtist ? subscriptionsProQueryOptions(0, 1) : subscriptionsPremiumQueryOptions(0, 1),
  );

  // Get subscription ID from subscriptions data
  const subscription = subscriptionsData?.subscriptions?.items?.[0];
  const subscriptionId = subscription?.id;

  // Query for subscription plans based on subscription ID and user role
  const {
    data: proPlansData,
    isLoading: proPlansLoading,
    error: proPlansError,
  } = useQuery({
    ...proSubscriptionPlansQueryOptions(subscriptionId || ""),
    enabled: isArtist && !!subscriptionId,
  });

  const {
    data: premiumPlansData,
    isLoading: premiumPlansLoading,
    error: premiumPlansError,
  } = useQuery({
    ...premiumSubscriptionPlansQueryOptions(subscriptionId || ""),
    enabled: !isArtist && !!subscriptionId,
  });

  // Use the appropriate data based on user role
  const plansData = isArtist ? proPlansData : premiumPlansData;
  const plansLoading = isArtist ? proPlansLoading : premiumPlansLoading;
  const plansError = isArtist ? proPlansError : premiumPlansError;

  // Query for entitlements based on user role
  const { data: entitlementsData, isLoading: entitlementsLoading } = useQuery(
    isArtist ? artistProEntitlementsQueryOptions() : listenerPremiumEntitlementsQueryOptions(),
  );

  // Query for coupons based on user role
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    isArtist ? availableCouponsQueryARTIST20FOREVEROptions() : availableCouponsQueryLISTENER10FOREVEROptions(),
  );

  const rawPlans = plansData?.subscriptionPlans?.items || [];
  const plans = transformPlans(rawPlans);

  // Extract features from entitlements
  const features = entitlementsData?.entitlements?.items?.map((item) => item.name) || [];

  // Debug: Log entitlements data
  console.log("🔍 Debug entitlements:", {
    isArtist,
    userRole,
    user,
    entitlementsLoading,
    entitlementsData: entitlementsData?.entitlements?.items,
    features,
    subscriptionId,
    subscription,
    queryEnabled: isArtist ? "artistProEntitlementsQueryOptions" : "listenerPremiumEntitlementsQueryOptions",
  });

  // Get coupon discount
  const coupon = couponsData?.coupons?.items?.[0];
  const couponDiscount = coupon?.percentOff || 0;

  const isLoading = subscriptionsLoading || plansLoading || entitlementsLoading || couponsLoading;

  const handleExploreClick = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // TODO: Implement plan selection logic
    console.log("Selected plan:", plan);

    const planId = plan.id;
    const tier = plan.subscription?.[0]?.tier;

    if (tier === "FREE") {
      console.log("Redirecting to signup for free plan", planId);
    } else {
      console.log("Redirecting to signup for paid plan", planId, tier);
    }
  };

  // Handle no subscription found
  if (!subscriptionsLoading && !subscription) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-amber-600">No Subscription Available</h1>
          <p className="text-muted-foreground">
            {isArtist
              ? "No Pro subscription plans available for artists at the moment."
              : "No Premium subscription plans available for listeners at the moment."}
          </p>
        </div>
      </ClientLayout>
    );
  }

  if (plansError) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
          <p className="text-muted-foreground">Unable to load subscription plans. Please try again later.</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <SubscriptionHeroSection onExploreClick={handleExploreClick} />

        {/* Plans Grid Section */}
        <div ref={plansRef}>
          <SubscriptionPlansGridSection
            plans={plans}
            isLoading={isLoading}
            onSelectPlan={handleSelectPlan}
            couponDiscount={couponDiscount}
            premiumFeatures={isArtist ? [] : features}
            proFeatures={isArtist ? features : []}
          />
        </div>

        {/* Call to Action Footer */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              {isArtist ? "Ready to Boost Your Music Career?" : "Ready to Start Your Music Journey?"}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
              {isArtist
                ? "Join thousands of professional artists. Choose your Pro plan and start sharing your music with the world."
                : "Join thousands of music lovers. Choose your Premium plan and start exploring unlimited music today."}
            </p>
            {couponDiscount > 0 && (
              <div className="mb-6">
                <p className="text-lg font-semibold text-yellow-300">
                  🎉 Limited Time: Save {couponDiscount}% with code {coupon?.name}!
                </p>
              </div>
            )}
            <button
              onClick={handleExploreClick}
              className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-purple-600 transition-colors hover:bg-gray-100"
            >
              View {isArtist ? "Pro" : "Premium"} Plans
            </button>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}
