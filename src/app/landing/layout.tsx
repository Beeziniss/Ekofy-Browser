import React from 'react';
import ClientHeader from '@/modules/client/common/ui/components/client-header';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <div className="h-full w-full pt-16">
      {/* Header only */}
      <ClientHeader />

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  );
};

export default LandingLayout;
