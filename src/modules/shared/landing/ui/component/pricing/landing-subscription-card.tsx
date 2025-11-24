'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/utils/format-number';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LandingSubscriptionCardProps {
  title: string;
  description?: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice?: number;
  currency?: string;
  badge?: string;
  onSelectPlan: (period: 'monthly' | 'yearly') => void;
}

export function LandingSubscriptionCard({
  title,
  description,
  features,
  monthlyPrice,
  yearlyPrice,
  currency = 'VND',
  badge = 'MOST POPULAR',
  onSelectPlan,
}: LandingSubscriptionCardProps) {
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate savings for yearly plans
  const calculateSavings = () => {
    if (!yearlyPrice || selectedInterval !== 'yearly') return null;

    const yearlyAtMonthlyRate = monthlyPrice * 12;
    const savings = yearlyAtMonthlyRate - yearlyPrice;
    const savingsPercentage = Math.round((savings / yearlyAtMonthlyRate) * 100);

    return savingsPercentage > 0 ? savingsPercentage : null;
  };

  const displayPrice = selectedInterval === 'yearly' && yearlyPrice ? yearlyPrice : monthlyPrice;
  const savingsPercentage = calculateSavings();

  const styling = {
    cardClass: 'bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500',
    borderGradient: 'primary_gradient',
    bgClass: 'bg-[#121212]',
    textColor: 'text-white',
    badgeClass: 'primary_gradient text-white border-none',
    toggleBg: 'bg-[#262626] border',
    toggleActiveClass: 'bg-[#303030] text-white',
    toggleInactiveClass: 'text-gray-400 hover:text-white',
    priceGradient: 'primary_gradient bg-clip-text text-transparent',
    subTextColor: 'text-gray-400',
    buttonClass: 'primary_gradient hover:opacity-80 text-white shadow-lg border-none',
    featureIconBg: 'bg-green-500/20',
    featureIconColor: 'text-green-400',
    featureTextColor: 'text-gray-300',
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${styling.cardClass}`}>
      {/* Gradient border */}
      <div className={`absolute inset-0 ${styling.borderGradient} rounded-lg p-[2px]`}>
        <div className={`${styling.bgClass} h-full w-full rounded-lg`} />
      </div>

      <CardHeader className="relative z-10 space-y-4 pb-3 text-start">
        {/* Title and Badge */}
        <div className="flex items-start justify-start space-x-3">
          <div>
            <CardTitle className={`text-2xl font-bold ${styling.textColor}`}>{title}</CardTitle>
            {badge && <Badge className={`mt-1 flex justify-start ${styling.badgeClass}`}>{badge}</Badge>}
          </div>
        </div>

        {description && <p className={`text-sm ${styling.subTextColor}`}>{description}</p>}
      </CardHeader>

      <CardContent className="relative z-10 space-y-3">
        {/* Billing Toggle - Only show if yearlyPrice is provided */}
        {yearlyPrice && (
          <div className="flex w-full justify-start">
            <div className={`flex w-full max-w-sm rounded-[999px] p-1 ${styling.toggleBg}`}>
              <button
                onClick={() => setSelectedInterval('monthly')}
                className={`flex-1 rounded-[999px] px-6 py-3 text-sm font-medium transition-all ${
                  selectedInterval === 'monthly' ? styling.toggleActiveClass : styling.toggleInactiveClass
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedInterval('yearly')}
                className={`flex-1 rounded-[999px] px-6 py-3 text-sm font-medium transition-all ${
                  selectedInterval === 'yearly' ? styling.toggleActiveClass : styling.toggleInactiveClass
                }`}
              >
                Annual
              </button>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-baseline justify-start space-x-1">
            <span className={`text-2xl font-bold ${styling.priceGradient}`}>
              {formatNumber(displayPrice)} {currency}
            </span>
            <span className={`text-lg ${styling.subTextColor}`}>
              /{selectedInterval === 'yearly' ? 'year' : 'month'}
            </span>
          </div>

          {/* Show yearly savings */}
          {selectedInterval === 'yearly' && savingsPercentage && savingsPercentage > 0 && (
            <p className="mt-2 text-sm font-medium text-green-400">💰 Save {savingsPercentage}% vs monthly</p>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-4">
          <h4 className={`flex justify-start font-semibold ${styling.textColor}`}>Key features:</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
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
        <Button
          className={`h-12 w-full text-base font-semibold transition-all duration-200 ${styling.buttonClass}`}
          onClick={() => onSelectPlan(selectedInterval)}
        >
          Start Premium Trial
        </Button>
      </CardContent>
    </Card>
  );
}
