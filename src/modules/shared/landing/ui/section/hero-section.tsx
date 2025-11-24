'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroTitle } from '../component/hero/hero-title';
import { HeroSubtitle } from '../component/hero/hero-subtitle';
import { HeroCta } from '../component/hero/hero-cta';

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-main-purple/20 via-main-dark-bg to-main-blue/20 pointer-events-none" />
      
      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-main-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-main-blue/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        <HeroTitle>
          WHERE MUSIC
          <br />
          <span className="text-primary-gradient">MEETS OPPORTUNITY</span>
        </HeroTitle>
        
        <HeroSubtitle className="mx-auto">
          Empowering independent artists to thrive while delivering personalized, 
          immersive music experiences to listeners worldwide.
        </HeroSubtitle>
        
        <HeroCta
          className="justify-center pt-4"
          primaryText="Start Your Journey"
          secondaryText="Explore Features"
          onPrimaryClick={() => router.push('/sign-up')}
          onSecondaryClick={() => {
            const featuresSection = document.getElementById('features');
            featuresSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary-gradient">10K+</div>
            <div className="text-main-grey">Active Artists</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary-gradient">1M+</div>
            <div className="text-main-grey">Tracks Uploaded</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary-gradient">50M+</div>
            <div className="text-main-grey">Monthly Listeners</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};
