'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="py-5 px-4 bg-main-dark-bg-1">
      <div className="w-full mx-auto">
        <div className="primary_gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-main-white">
              Ready to Transform Your Music Journey?
            </h2>
            <p className="text-xl text-main-white/90 max-w-2xl mx-auto">
              Join thousands of independent artists and music lovers who are already part of the Ekofy community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-main-white text-main-purple font-semibold px-8 py-6 text-base rounded-full hover:bg-main-white/90 transition-colors"
                onClick={() => router.push('/sign-up')}
              >
                Start for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-main-white text-main-white font-semibold px-8 py-6 text-base rounded-full hover:bg-main-white/10 transition-colors"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
