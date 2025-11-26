import React from 'react';
import { cn } from '@/lib/utils';

interface HeroTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const HeroTitle = ({ className, children }: HeroTitleProps) => {
  return (
    <h1
      className={cn(
        'text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-main-white leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </h1>
  );
};
