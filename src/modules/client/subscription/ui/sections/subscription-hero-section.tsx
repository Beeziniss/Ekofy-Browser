"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Star, Headphones, Mic, Radio, TrendingUp, Award } from "lucide-react";
import { useAuthStore } from "@/store/stores/auth-store";
import { UserRole } from "@/types/role";

interface SubscriptionHeroSectionProps {
  onExploreClick: () => void;
}

export function SubscriptionHeroSection({ onExploreClick }: SubscriptionHeroSectionProps) {
  const { user } = useAuthStore();
  const isArtist = user?.role === UserRole.ARTIST;

  const artistFeatures = [
    {
      icon: Music,
      title: "Professional Music Distribution",
      description: "Distribute to all major platforms",
    },
    {
      icon: Mic,
      title: "Studio Quality Recording",
      description: "Upload unlimited high-quality tracks",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track performance and audience insights",
    },
    {
      icon: Award,
      title: "Artist Verification",
      description: "Get verified artist status and perks",
    },
  ];

  const listenerFeatures = [
    {
      icon: Music,
      title: "Search track by audio file",
      description: "Find any song instantly",
    },
    {
      icon: Headphones,
      title: "Premium quality audio",
      description: "320kbit/s crystal clear sound",
    },
    {
      icon: Star,
      title: "Track suggestions",
      description: "Daily personalized recommendations",
    },
    {
      icon: Radio,
      title: "Unlimited streaming",
      description: "Millions of tracks worldwide",
    },
  ];

  const features = isArtist ? artistFeatures : listenerFeatures;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800">
      <div className="absolute inset-0 bg-black/10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-300/10 blur-3xl delay-1000" />
      </div>

      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-10 text-center text-white">
          <div className="space-y-6">
            <h1 className="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl">
              {isArtist ? "Professional Artist Platform" : "Premium Music Experience"}
            </h1>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-purple-100 lg:text-2xl">
              {isArtist
                ? "Elevate your music career with professional tools, distribution, and analytics to reach millions of listeners worldwide"
                : "Bring to you the best experience with unlimited music streaming, premium quality audio, and exclusive artist collaborations"}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
              >
                <CardContent className="p-6 text-center">
                  <feature.icon className="mx-auto mb-4 h-10 w-10 text-purple-200" />
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-purple-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            size="lg"
            className="rounded-xl bg-white px-10 py-4 text-xl font-semibold text-purple-600 shadow-2xl transition-all duration-300 hover:bg-purple-50 hover:shadow-purple-500/25"
            onClick={onExploreClick}
          >
            Explore {isArtist ? "Pro" : "Premium"} Plans ✨
          </Button>
        </div>
      </div>
    </section>
  );
}
