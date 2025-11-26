'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLandingSubscription } from '../../hooks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PeriodTime } from '@/gql/graphql';
import { LandingSubscriptionCard } from '../component/pricing/landing-subscription-card';

export const PricingSection = () => {
  const router = useRouter();
  const { plan, features, isLoading } = useLandingSubscription();

  // Show loading state
  if (isLoading) {
    return (
      <section id="pricing" className="py-20 px-4 bg-main-dark-bg-1">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl text-main-white">Choose Your Plan</h2>
            <p className="text-main-grey mx-auto mb-8 max-w-2xl text-lg">
              Start free and upgrade as you grow. All plans include secure payments and transparent royalties.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-main-grey">Loading subscription plans...</div>
          </div>
        </div>
      </section>
    );
  }

  // Get monthly and yearly prices
  const monthlyPriceData = plan?.subscriptionPlanPrices?.find(
    (price) => price.interval === PeriodTime.Month && price.intervalCount === 1
  );
  
  const yearlyPriceData = plan?.subscriptionPlanPrices?.find(
    (price) => price.interval === PeriodTime.Year || 
    (price.interval === PeriodTime.Month && price.intervalCount === 12)
  );

  const monthlyPrice = monthlyPriceData?.stripePriceUnitAmount 
    ? Number(monthlyPriceData.stripePriceUnitAmount) 
    : 65000;
    
  const yearlyPrice = yearlyPriceData?.stripePriceUnitAmount 
    ? Number(yearlyPriceData.stripePriceUnitAmount) 
    : undefined;

  const currency = monthlyPriceData?.stripePriceCurrency?.toUpperCase() || 'VND';

  const handleSelectPlan = () => {
    router.push('/subscription');
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-main-dark-bg-1">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl text-main-white">Choose Your Plan</h2>
          <p className="text-main-grey mx-auto mb-8 max-w-2xl text-lg">
            Start free and upgrade as you grow. All plans include secure payments and transparent royalties.
          </p>
        </div>
        
        {/* Single Premium Plan Card - Centered */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <LandingSubscriptionCard
              title={plan?.stripeProductName || 'Premium Plan Listener'}
              description="For serious independent artists"
              features={features.length > 0 ? features : [
                'High Quality Audio',
                'Track Skip Limit',
                'Priority Support',
                'Period Time Track Recommendations',
              ]}
              monthlyPrice={monthlyPrice}
              yearlyPrice={yearlyPrice}
              currency={currency}
              badge="MOST POPULAR"
              onSelectPlan={handleSelectPlan}
            />
          </div>
        </div>

        {/* Discover All Plans Button */}
        <div className="flex justify-center">
          <Link href="/subscription">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-main-grey-dark-bg text-main-white font-semibold px-8 py-6 text-base rounded-full hover:bg-main-grey-dark-bg transition-colors"
            >
              Discover all our plans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
