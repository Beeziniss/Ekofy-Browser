import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <Card className={cn('bg-main-card-bg border-main-grey-1 hover:bg-main-grey-1 transition-colors group', className)}>
      <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full primary_gradient flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="text-main-white">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold text-main-white">{title}</h3>
        <p className="text-main-grey text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};
