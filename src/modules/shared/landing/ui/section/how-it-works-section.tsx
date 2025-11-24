import React from 'react';
import { Mic, Headphones } from 'lucide-react';
import { SectionTitle } from '../component/common/section-title';

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="How Ekofy Works"
          subtitle="Two pathways to success - whether you're an artist or a music lover"
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Artists */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full primary_gradient flex items-center justify-center">
                <Mic className="w-6 h-6 text-main-white" />
              </div>
              <h3 className="text-2xl font-bold text-main-white">For Artists</h3>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  description: 'Sign up and build your artist profile with your music, bio, and portfolio.',
                },
                {
                  step: '02',
                  title: 'Upload Your Music',
                  description: 'Share your tracks with the world and start building your audience.',
                },
                {
                  step: '03',
                  title: 'Offer Services',
                  description: 'Create custom packages for commissions, collaborations, or exclusive content.',
                },
                {
                  step: '04',
                  title: 'Earn & Grow',
                  description: 'Get paid directly, track your revenue, and watch your career flourish.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="text-3xl font-bold text-primary-gradient">{item.step}</div>
                  <div className="flex-1 pt-1">
                    <h4 className="text-xl font-semibold text-main-white mb-2">{item.title}</h4>
                    <p className="text-main-grey leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Listeners */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full primary_gradient flex items-center justify-center">
                <Headphones className="w-6 h-6 text-main-white" />
              </div>
              <h3 className="text-2xl font-bold text-main-white">For Listeners</h3>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Discover Music',
                  description: 'Explore a diverse catalog of independent artists and unique sounds.',
                },
                {
                  step: '02',
                  title: 'Create Playlists',
                  description: 'Build personalized collections and enjoy curated recommendations.',
                },
                {
                  step: '03',
                  title: 'Support Artists',
                  description: 'Request custom work, commission tracks, or hire artists for projects.',
                },
                {
                  step: '04',
                  title: 'Connect & Share',
                  description: 'Engage with artists directly and share your favorite discoveries.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="text-3xl font-bold text-primary-gradient">{item.step}</div>
                  <div className="flex-1 pt-1">
                    <h4 className="text-xl font-semibold text-main-white mb-2">{item.title}</h4>
                    <p className="text-main-grey leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
