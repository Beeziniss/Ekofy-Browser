'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroCtaProps {
  className?: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const HeroCta = ({
  className,
  primaryText = 'Get Started',
  secondaryText = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
}: HeroCtaProps) => {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-4 items-center', className)}>
      <Button
        size="lg"
        className="primary_gradient text-main-white font-semibold px-8 py-6 text-base rounded-full hover:opacity-90 transition-opacity"
        onClick={onPrimaryClick}
      >
        {primaryText}
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-main-grey-dark-bg text-main-white font-semibold px-8 py-6 text-base rounded-full hover:bg-main-grey-dark-bg transition-colors"
        onClick={onSecondaryClick}
      >
        {secondaryText}
      </Button>
    </div>
  );
};
