"use client";

import React from "react";

interface PackageServiceLayoutProps {
  children: React.ReactNode;
}

const PackageServiceLayout = ({ children }: PackageServiceLayoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default PackageServiceLayout;
