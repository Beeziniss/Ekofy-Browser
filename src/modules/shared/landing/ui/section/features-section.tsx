import React from 'react';
import { Music, Package, MessageSquare, DollarSign, TrendingUp, Users } from 'lucide-react';
import { SectionTitle } from '../component/common/section-title';
import { FeatureCard } from '../component/features/feature-card';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Upload & Promote',
      description: 'Easily upload your music and reach a global audience with powerful promotion tools and analytics.',
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Custom Packages',
      description: 'Create and offer personalized service packages to monetize your talent and skills.',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Direct Requests',
      description: 'Connect directly with listeners who want custom work, collaborations, or exclusive content.',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'Integrated payment solutions with transparent royalty management for sustainable income.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Growth Analytics',
      description: 'Track your progress with detail insights into streams, engagement, and revenue.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Join a thriving community of artists and listeners passionate about independent music.',
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Everything You Need to Succeed"
          subtitle="Powerful tools designed for independent artists to grow their career and connect with fans"
          centered
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
