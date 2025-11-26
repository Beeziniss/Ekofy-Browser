import React from 'react';
import { HowItWorksSection } from '../section/how-it-works-section';
import { FeaturesSection } from '../section/features-section';

export const FeaturesLayout = () => {
  return (
    <div className="w-full">
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
};
