"use client";

import React from "react";
import { EkofyLogo } from "@/assets/icons";

interface ForgotPasswordLayoutProps {
  children: React.ReactNode;
}

const ForgotPasswordLayout: React.FC<ForgotPasswordLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-main-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="mr-3 flex items-center justify-center">
                <EkofyLogo className="size-[60px]" />
              </div>
              <h1 className="text-primary-gradient text-4xl font-bold">Ekofy</h1>
            </div>
            <p className="text-gray-400 text-sm">Secure Password Recovery</p>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordLayout;