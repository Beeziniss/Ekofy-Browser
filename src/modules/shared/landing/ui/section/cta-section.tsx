"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="bg-main-dark-bg-1 px-4 py-5">
      <div className="mx-auto w-full">
        <div className="primary_gradient relative overflow-hidden rounded-3xl p-12 text-center md:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-main-white text-4xl font-bold md:text-5xl">Ready to Transform Your Music Journey?</h2>
            <p className="text-main-white/90 mx-auto max-w-2xl text-xl">
              Join thousands of independent artists and music lovers who are already part of the Ekofy community.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-main-white text-main-purple hover:bg-main-white/90 rounded-full px-8 py-6 text-base font-bold transition-colors"
                onClick={() => router.push("/sign-up")}
              >
                Start for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-main-white text-main-white hover:bg-main-white/10 rounded-full border-2 px-8 py-6 text-base font-semibold transition-colors"
                onClick={() => router.push("/login")}
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
