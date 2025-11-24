import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating?: number;
  className?: string;
}

export const TestimonialCard = ({
  name,
  role,
  avatar,
  content,
  rating = 5,
  className,
}: TestimonialCardProps) => {
  return (
    <Card className={cn('bg-main-card-bg border-main-grey-1', className)}>
      <CardContent className="pt-6 space-y-4">
        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, index) => (
            <Star key={index} className="w-4 h-4 fill-main-purple text-main-purple" />
          ))}
        </div>

        {/* Testimonial content */}
        <p className="text-main-grey-dark leading-relaxed italic">&ldquo;{content}&rdquo;</p>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-2">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full primary_gradient flex items-center justify-center">
              <span className="text-main-white font-semibold text-lg">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="text-main-white font-semibold">{name}</div>
            <div className="text-main-grey text-sm">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
