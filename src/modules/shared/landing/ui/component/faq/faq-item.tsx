'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  className?: string;
}

export const FaqItem = ({ question, answer, className }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        'border border-main-grey-1 rounded-xl overflow-hidden bg-main-card-bg hover:bg-main-grey-1 transition-colors',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
      >
        <h3 className="text-main-white font-semibold text-lg">{question}</h3>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-main-grey shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'px-6 overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <p className="text-main-grey leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};
