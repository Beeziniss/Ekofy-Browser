"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroTitle } from "../component/hero/hero-title";
import { HeroSubtitle } from "../component/hero/hero-subtitle";
import { HeroCta } from "../component/hero/hero-cta";

export const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient background effect */}
      <div className="from-main-purple/20 via-main-dark-bg to-main-blue/20 pointer-events-none absolute inset-0 bg-gradient-to-br" />

      {/* Animated circles background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-main-purple/10 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-main-blue/10 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 text-center">
        <HeroTitle>
          WHERE MUSIC
          <br />
          <span className="text-primary-gradient">MEETS OPPORTUNITY</span>
        </HeroTitle>

        <HeroSubtitle className="mx-auto">
          Empowering independent artists to thrive while delivering personalized, immersive music experiences to
          listeners worldwide.
        </HeroSubtitle>

        <HeroCta
          className="justify-center pt-4"
          primaryText="Start Your Journey"
          secondaryText="Explore Features"
          onPrimaryClick={() => router.push("/welcome")}
          onSecondaryClick={() => {
            const featuresSection = document.getElementById("features");
            featuresSection?.scrollIntoView({ behavior: "smooth" });
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
