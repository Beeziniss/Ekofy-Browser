import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionTitle = ({ title, subtitle, centered = false, className }: SectionTitleProps) => {
  return (
    <div className={cn('space-y-3', centered && 'text-center', className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-main-white">{title}</h2>
      {subtitle && <p className="text-main-grey text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
};
