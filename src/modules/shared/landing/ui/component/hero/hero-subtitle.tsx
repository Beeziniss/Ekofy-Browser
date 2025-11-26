import React from 'react';
import { cn } from '@/lib/utils';

interface HeroSubtitleProps {
  className?: string;
  children: React.ReactNode;
}

export const HeroSubtitle = ({ className, children }: HeroSubtitleProps) => {
  return (
    <p
      className={cn(
        'text-lg md:text-xl lg:text-2xl text-main-grey-dark max-w-3xl',
        className
      )}
    >
      {children}
    </p>
  );
};
