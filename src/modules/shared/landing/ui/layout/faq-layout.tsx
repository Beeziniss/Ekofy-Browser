import React from 'react';
import { FaqSection } from '../section/faq-section';
import { CtaSection } from '../section/cta-section';

export const FaqLayout = () => {
  return (
    <div className="w-full">
      <FaqSection />
      <CtaSection />
    </div>
  );
};
