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
      description: "Distribute to all major platforms"
    },
    {
      icon: Mic,
      title: "Studio Quality Recording",
      description: "Upload unlimited high-quality tracks"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Track performance and audience insights"
    },
    {
      icon: Award,
      title: "Artist Verification",
      description: "Get verified artist status and perks"
    }
  ];

  const listenerFeatures = [
    {
      icon: Music,
      title: "Search track by audio file",
      description: "Find any song instantly"
    },
    {
      icon: Headphones,
      title: "Premium quality audio",
      description: "320kbit/s crystal clear sound"
    },
    {
      icon: Star,
      title: "Track suggestions",
      description: "Daily personalized recommendations"
    },
    {
      icon: Radio,
      title: "Unlimited streaming",
      description: "Millions of tracks worldwide"
    }
  ];

  const features = isArtist ? artistFeatures : listenerFeatures;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800">
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="text-center text-white space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
              {isArtist ? "Professional Artist Platform" : "Premium Music Experience"}
            </h1>
            <p className="text-xl lg:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              {isArtist 
                ? "Elevate your music career with professional tools, distribution, and analytics to reach millions of listeners worldwide"
                : "Bring to you the best experience with unlimited music streaming, premium quality audio, and exclusive artist collaborations"
              }
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-10 h-10 mx-auto mb-4 text-purple-200" />
                  <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                  <p className="text-sm text-purple-100 mt-2">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 px-10 py-4 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            onClick={onExploreClick}
          >
            Explore {isArtist ? "Pro" : "Premium"} Plans ✨
          </Button>
        </div>
      </div>
    </section>
  );
}