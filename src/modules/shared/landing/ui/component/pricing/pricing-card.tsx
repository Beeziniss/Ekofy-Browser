import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  badge?: string;
  className?: string;
}

export const PricingCard = ({
  title,
  price,
  period = '/month',
  description,
  features,
  highlighted = false,
  ctaText = 'Get Started',
  onCtaClick,
  badge,
  className,
}: PricingCardProps) => {
  return (
    <Card
      className={cn(
        'bg-main-white border-0 relative overflow-hidden',
        highlighted && 'ring-2 ring-main-purple shadow-2xl scale-105',
        className
      )}
    >
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="primary_gradient text-main-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            {badge}
          </span>
        </div>
      )}
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold text-main-dark-bg mb-2">{title}</CardTitle>
        <div className="flex items-baseline justify-center gap-1 mt-4">
          <span className="text-5xl font-bold text-main-dark-bg">{price}</span>
          {period && <span className="text-main-grey-dark-1 text-lg">{period}</span>}
        </div>
        {description && <p className="text-main-grey-dark-1 text-sm mt-2">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          size="lg"
          className={cn(
            'w-full rounded-full font-semibold',
            highlighted
              ? 'primary_gradient text-main-white hover:opacity-90'
              : 'bg-main-dark-bg text-main-white hover:bg-main-dark-bg-1'
          )}
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-main-purple shrink-0 mt-0.5" />
              <span className="text-main-dark-bg text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
