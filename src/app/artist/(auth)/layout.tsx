import React from "react";

interface ArtistAuthLayoutProps {
  children: React.ReactNode;
}

const ArtistAuthLayout = ({ children }: ArtistAuthLayoutProps) => {
  return <div className="bg-background h-full w-full">{children}</div>;
};

export default ArtistAuthLayout;
