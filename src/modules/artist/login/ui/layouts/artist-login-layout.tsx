import React from "react";

interface ArtistLoginLayoutProps {
  children: React.ReactNode;
}

const ArtistLoginLayout = ({ children }: ArtistLoginLayoutProps) => {
  return <div className="flex w-full">{children}</div>;
};

export default ArtistLoginLayout;
