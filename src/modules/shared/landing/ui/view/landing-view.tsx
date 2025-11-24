"use client";

import React from 'react';
import { HeroLayout } from '../layout/hero-layout';
import { FeaturesLayout } from '../layout/features-layout';
import { PricingLayout } from '../layout/pricing-layout';
import { FaqLayout } from '../layout/faq-layout';


const LandingView = () => {
  return (
    <div className="w-full min-h-screen bg-main-dark-bg">
      <HeroLayout />
      <FeaturesLayout />
      <PricingLayout />
      <FaqLayout />
    </div>
  );
};

export default LandingView;