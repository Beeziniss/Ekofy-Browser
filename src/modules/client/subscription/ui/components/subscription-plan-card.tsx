"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/format-number";
import { PeriodTime, SubscriptionPlan, UserRole } from "@/gql/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { listenerOpenTransactionsOptions } from "@/gql/options/listener-activity-options";
import { userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  keyFeatures?: string[];
  couponDiscount?: number;
  onSelectPlan: (subscriptionCode: string, period: PeriodTime) => void;
}

export function SubscriptionPlanCard({
  plan,
  onSelectPlan,
  couponDiscount = 0,
  keyFeatures = [],
}: SubscriptionPlanCardProps) {
  const { user } = useAuthStore();
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "yearly">("monthly");
  const subscription = plan.subscription?.[0];

  // Check for open transactions
  const { data: openTransactionData } = useQuery({
    ...listenerOpenTransactionsOptions({ userId: user?.userId || "" }),
    enabled: !!user?.userId,
  });

  // Check for active subscription
  const { data: userActiveSubscription } = useQuery({
    ...userActiveSubscriptionOptions(user?.userId || ""),
    enabled: !!user?.userId,
  });

  const hasOpenTransaction =
    openTransactionData?.transactions?.items && openTransactionData.transactions.items.length > 0;
  const openTransaction = hasOpenTransaction ? openTransactionData?.transactions?.items?.[0] : null;

  // Check if this plan is the user's current active plan
  const isCurrentPlan = userActiveSubscription?.subscription?.[0]?.tier === subscription.tier;

  const isPro = subscription.tier === "PRO";
  const isPremium = subscription.tier === "PREMIUM";

  // Find the correct price based on selected interval
  const getCorrectPrice = () => {
    const prices = plan.subscriptionPlanPrices.filter((p) => p.stripePriceActive);

    if (selectedInterval === "monthly") {
      return prices.find((p) => p.interval === PeriodTime.Month && p.intervalCount === 1) || prices[0];
    } else {
      return (
        prices.find(
          (p) => p.interval === PeriodTime.Year || (p.interval === PeriodTime.Month && p.intervalCount === 12),
        ) || prices[0]
      );
    }
  };

  // Calculate savings for yearly plans
  const calculateSavings = () => {
    if (selectedInterval !== "yearly") return null;

    const prices = plan.subscriptionPlanPrices.filter((p) => p.stripePriceActive);
    const monthlyPrice = prices.find((p) => p.interval === "MONTH" && p.intervalCount === 1);
    const yearlyPrice = prices.find((p) => p.interval === "YEAR" || (p.interval === "MONTH" && p.intervalCount === 12));

    if (!monthlyPrice || !yearlyPrice) return null;

    // Calculate yearly cost if paying monthly (monthly price * 12)
    const yearlyAtMonthlyRate = monthlyPrice.stripePriceUnitAmount * 12;
    const actualYearlyPrice = yearlyPrice.stripePriceUnitAmount;

    // Calculate savings
    const savings = yearlyAtMonthlyRate - actualYearlyPrice;
    const savingsPercentage = Math.round((savings / yearlyAtMonthlyRate) * 100);

    return savingsPercentage > 0 ? savingsPercentage : null;
  };

  const mainPrice = getCorrectPrice();
  const savingsPercentage = calculateSavings();

  if (!subscription || !mainPrice) return null;

  // Calculate price with coupon discount (only for yearly)
  const originalPrice = mainPrice.stripePriceUnitAmount;
  const shouldApplyCoupon = selectedInterval === "yearly" && couponDiscount > 0;
  const discountedPrice = shouldApplyCoupon ? originalPrice * (1 - couponDiscount / 100) : originalPrice;

  // For display: if yearly, show yearly price; if monthly, show monthly price
  const displayPrice = discountedPrice;
  const pricePerMonth = displayPrice;

  // Use provided key features or fallback to metadata
  const getFeatures = () => {
    if (keyFeatures.length > 0) return keyFeatures;

    if (!plan.stripeProductMetadata) return [];
    return plan.stripeProductMetadata
      .filter((meta) => meta.key.toLowerCase().includes("feature") || meta.key.toLowerCase().includes("benefit"))
      .map((meta) => meta.value);
  };

  const features = getFeatures();

  // Determine card styling based on tier
  const getCardStyling = () => {
    if (isPro) {
      return {
        cardClass: "bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500",
        borderGradient: "primary_gradient",
        bgClass: "bg-[#121212]",
        textColor: "text-white",
        badgeText: "PRO",
        badgeClass: "primary_gradient text-white border-none",
        iconBg: "primary_gradient",
        toggleBg: "bg-[#262626] border",
        toggleActiveClass: "bg-[#303030] text-white",
        toggleInactiveClass: "text-gray-400 hover:text-white",
        priceGradient: "primary_gradient bg-clip-text text-transparent",
        subTextColor: "text-gray-400",
        buttonClass: "primary_gradient hover:opacity-80 text-white shadow-lg border-none",
        featureIconBg: "bg-green-500/20",
        featureIconColor: "text-green-400",
        featureTextColor: "text-gray-300",
        footerTextColor: "text-gray-400",
      };
    } else if (isPremium) {
      return {
        cardClass: "bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500",
        borderGradient: "primary_gradient",
        bgClass: "bg-[#121212]",
        textColor: "text-white",
        badgeText: "PREMIUM",
        badgeClass: "primary_gradient text-white border-none",
        iconBg: "primary_gradient",
        toggleBg: "bg-[#262626] border",
        toggleActiveClass: "bg-[#303030] text-white",
        toggleInactiveClass: "text-gray-400 hover:text-white",
        priceGradient: "primary_gradient bg-clip-text text-transparent",
        subTextColor: "text-gray-400",
        buttonClass: "primary_gradient hover:opacity-80 text-white shadow-lg border-none",
        featureIconBg: "bg-green-500/20",
        featureIconColor: "text-green-400",
        featureTextColor: "text-gray-300",
        footerTextColor: "text-gray-400",
      };
    } else {
      return {
        cardClass: "bg-white border border-gray-200",
        borderGradient: "",
        bgClass: "bg-white",
        textColor: "text-gray-900",
        badgeText: "FREE",
        badgeClass: "bg-gray-100 text-gray-700 border border-gray-200",
        iconBg: "bg-gradient-to-r from-gray-500 to-gray-600",
        toggleBg: "bg-gray-100 border border-gray-200",
        toggleActiveClass: "bg-white text-gray-900 shadow-sm",
        toggleInactiveClass: "text-gray-500 hover:text-gray-900",
        priceGradient: "text-gray-900",
        subTextColor: "text-gray-500",
        buttonClass: "bg-gray-900 hover:bg-gray-800 text-white",
        featureIconBg: "bg-green-100",
        featureIconColor: "text-green-600",
        featureTextColor: "text-gray-700",
        footerTextColor: "text-gray-500",
      };
    }
  };

  const styling = getCardStyling();

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${styling.cardClass}`}>
      {/* Gradient border for premium/pro */}
      {(isPremium || isPro) && (
        <div className={`absolute inset-0 ${styling.borderGradient} rounded-lg p-[2px]`}>
          <div className={`${styling.bgClass} h-full w-full rounded-lg`} />
        </div>
      )}

      <CardHeader className="relative z-10 space-y-4 pb-3 text-start">
        {/* Title and Icon */}
        <div className="flex items-start justify-start space-x-3">
          <div>
            <CardTitle className={`text-2xl font-bold ${styling.textColor}`}>{plan.stripeProductName}</CardTitle>
            {(isPremium || isPro) && (
              <Badge className={`mt-1 flex justify-start ${styling.badgeClass}`}>{styling.badgeText}</Badge>
            )}
          </div>
        </div>

        {subscription.description && <p className={`text-sm ${styling.subTextColor}`}>{subscription.description}</p>}
      </CardHeader>

      <CardContent className="relative z-10 space-y-3">
        {/* Billing Toggle */}
        <div className="flex w-full justify-start">
          <div className={`flex w-full max-w-sm rounded-[999px] p-1 ${styling.toggleBg}`}>
            <button
              onClick={() => setSelectedInterval("monthly")}
              className={`flex-1 rounded-[999px] px-6 py-3 text-sm font-medium transition-all ${
                selectedInterval === "monthly" ? styling.toggleActiveClass : styling.toggleInactiveClass
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedInterval("yearly")}
              className={`flex-1 rounded-[999px] px-6 py-3 text-sm font-medium transition-all ${
                selectedInterval === "yearly" ? styling.toggleActiveClass : styling.toggleInactiveClass
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-baseline justify-start space-x-1">
            <span className={`text-2xl font-bold ${styling.priceGradient}`}>
              {formatNumber(pricePerMonth)} {mainPrice.stripePriceCurrency.toUpperCase()}
            </span>
            <span className={`text-lg ${styling.subTextColor}`}>
              /{selectedInterval === "yearly" ? "year" : "month"}
            </span>
          </div>

          {/* Show original price if discounted (yearly + coupon) */}
          {shouldApplyCoupon && (
            <div className="mt-2 flex items-center justify-start space-x-2">
              <span className={`text-sm line-through ${styling.subTextColor}`}>
                {formatNumber(originalPrice)} {mainPrice.stripePriceCurrency.toUpperCase()}
              </span>
              <Badge className="border-none bg-green-500 text-xs text-white">Save {couponDiscount}%</Badge>
            </div>
          )}

          {/* Show yearly savings (without coupon) */}
          {selectedInterval === "yearly" && savingsPercentage && savingsPercentage > 0 && !shouldApplyCoupon && (
            <p className="mt-2 text-sm font-medium text-green-400">💰 Save {savingsPercentage}% vs monthly</p>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-4">
          <h4 className={`flex justify-start font-semibold ${styling.textColor}`}>Key features:</h4>
          <ul className="space-y-3">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className={`rounded-full p-1 ${styling.featureIconBg}`}>
                  <Check className={`h-3 w-3 ${styling.featureIconColor}`} />
                </div>
                <span className={`text-sm ${styling.featureTextColor}`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        {isCurrentPlan ? (
          <div
            className={`inline-flex h-12 w-full items-center justify-center text-base font-semibold ${styling.textColor} border-main-white/30 cursor-default rounded-md border ${styling.subTextColor}`}
          >
            Current Plan
          </div>
        ) : hasOpenTransaction && openTransaction ? (
          <Link
            href={`${String(user?.role) === String(UserRole.Artist) ? "/artist/studio" : "/profile"}/transactions/payment-history/${openTransaction.id}`}
            className={`inline-flex h-12 w-full items-center justify-center text-base font-semibold transition-all duration-200 ${styling.buttonClass} rounded-md`}
          >
            Continue Payment
          </Link>
        ) : (
          <Button
            className={`h-12 w-full text-base font-semibold transition-all duration-200 ${styling.buttonClass}`}
            onClick={() =>
              onSelectPlan(subscription.code, selectedInterval === "monthly" ? PeriodTime.Month : PeriodTime.Year)
            }
          >
            Select Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
