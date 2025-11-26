"use client";

import { Button } from "@/components/ui/button";

interface SubscriptionFooterSectionProps {
  isArtist: boolean;
  couponDiscount: number;
  coupon?: {
    name: string;
  };
  handleExploreClick: () => void;
}

const SubscriptionFooterSection = ({
  isArtist,
  couponDiscount,
  coupon,
  handleExploreClick,
}: SubscriptionFooterSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          {isArtist ? "Ready to Boost Your Music Career?" : "Ready to Start Your Music Journey?"}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
          {isArtist
            ? "Join thousands of professional artists. Choose your Pro plan and start sharing your music with the world."
            : "Join thousands of music lovers. Choose your Premium plan and start exploring unlimited music today."}
        </p>
        {couponDiscount > 0 && (
          <div className="mb-6">
            <p className="text-lg font-semibold text-yellow-300">
              🎉 Limited Time: Save {couponDiscount}% with code {coupon?.name}!
            </p>
          </div>
        )}
        <Button onClick={handleExploreClick} size={"lg"} className="bg-main-white text-lg font-semibold">
          View {isArtist ? "Pro" : "Premium"} Plans
        </Button>
      </div>
    </section>
  );
};

export default SubscriptionFooterSection;
