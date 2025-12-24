"use client";

import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  subscriptionsPremiumQueryOptions,
  subscriptionsProQueryOptions,
  premiumSubscriptionPlansQueryOptions,
  proSubscriptionPlansQueryOptions,
  listenerPremiumEntitlementsQueryOptions,
  artistProEntitlementsQueryOptions,
  availableCouponsQueryLISTENER10FOREVEROptions,
  availableCouponsQueryARTIST20FOREVEROptions,
} from "@/gql/options/subscription-clients-options";
import { UserRole } from "@/types/role";
import { PeriodTime } from "@/gql/graphql";
import { useAuthStore } from "@/store/stores/auth-store";
import SubscriptionFooterSection from "../sections/subscription-footer-section";
import { SubscriptionHeroSection } from "../sections/subscription-hero-section";
import { SubscriptionPlansGridSection } from "../sections/subscription-plans-grid-section";
import { subscriptionCreateCheckoutSessionMutationOptions } from "@/gql/options/client-mutation-options";

export function SubscriptionPlansPublicView() {
  const plansRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const userRole = user?.role;
  const isArtist = userRole === UserRole.ARTIST;

  const { mutateAsync: buySubscription } = useMutation(subscriptionCreateCheckoutSessionMutationOptions);
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery(
    isArtist ? subscriptionsProQueryOptions() : subscriptionsPremiumQueryOptions(),
  );
  const { data: couponsData, isLoading: couponsLoading } = useQuery(
    isArtist ? availableCouponsQueryARTIST20FOREVEROptions() : availableCouponsQueryLISTENER10FOREVEROptions(),
  );

  // Get subscription ID from subscriptions data
  const subscription = subscriptionsData?.subscriptions?.items?.[0];
  const subscriptionId = subscription?.id;
  const subscriptionCode = subscription?.code;

  const { data: entitlementsData, isLoading: entitlementsLoading } = useQuery({
    ...( subscriptionCode 
      ? (isArtist ? artistProEntitlementsQueryOptions(subscriptionCode) : listenerPremiumEntitlementsQueryOptions(subscriptionCode))
      : { queryKey: [], queryFn: async () => ({ entitlements: { items: [] } }) }
    ),
    enabled: !!subscriptionCode,
  });

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

  const plansData = proPlansData || premiumPlansData;
  const plansError = proPlansError || premiumPlansError;
  const plansLoading = proPlansLoading || premiumPlansLoading;

  const plans = plansData?.subscriptionPlans?.items || [];
  const features = entitlementsData?.entitlements?.items?.map((item) => item.name) || [];

  const coupon = couponsData?.coupons?.items?.[0];
  const couponDiscount = coupon?.percentOff || 0;

  const isLoading = subscriptionsLoading || plansLoading || entitlementsLoading || couponsLoading;

  const handleExploreClick = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = async (subscriptionCode: string, period: PeriodTime) => {
    try {
      const { createSubscriptionCheckoutSession } = await buySubscription({
        // TODO: Need to change url if necessary
        successUrl: window.location.origin,
        cancelUrl: window.location.origin,
        isSavePaymentMethod: false,
        period,
        subscriptionCode,
      });

      if (createSubscriptionCheckoutSession?.url) {
        // Open checkout in new tab
        window.open(createSubscriptionCheckoutSession.url);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      // You might want to show a user-friendly error message here
    }
  };

  // Handle no subscription found
  if (!subscriptionsLoading && !subscription) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-amber-600">No Subscription Available</h1>
        <p className="text-muted-foreground">
          {isArtist
            ? "No Pro subscription plans available for artists at the moment."
            : "No Premium subscription plans available for listeners at the moment."}
        </p>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-muted-foreground">Unable to load subscription plans. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <SubscriptionHeroSection onExploreClick={handleExploreClick} isArtist={isArtist} />

      {/* Plans Grid Section */}
      <div ref={plansRef}>
        <SubscriptionPlansGridSection
          plans={plans}
          isLoading={isLoading}
          onSelectPlan={handleSelectPlan}
          couponDiscount={couponDiscount}
          proFeatures={isArtist ? features : []}
          premiumFeatures={isArtist ? [] : features}
        />
      </div>

      {/* Call to Action Footer */}
      <SubscriptionFooterSection
        coupon={coupon}
        isArtist={isArtist}
        couponDiscount={couponDiscount}
        handleExploreClick={handleExploreClick}
      />
    </div>
  );
}
