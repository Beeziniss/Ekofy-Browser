import React from "react";

interface ArtistSignUpLayoutProps {
  children: React.ReactNode;
}

const ArtistSignUpLayout = ({ children }: ArtistSignUpLayoutProps) => {
  return <div className="flex min-h-screen w-full">{children}</div>;
};

export default ArtistSignUpLayout;
