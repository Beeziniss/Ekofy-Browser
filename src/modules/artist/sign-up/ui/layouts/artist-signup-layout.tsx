import React from "react";

interface ArtistSignUpLayoutProps {
  children: React.ReactNode;
}

const ArtistSignUpLayout = ({ children }: ArtistSignUpLayoutProps) => {
  return <div className="flex h-screen w-full overflow-hidden">{children}</div>;
};

export default ArtistSignUpLayout;
