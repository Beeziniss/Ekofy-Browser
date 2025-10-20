import React from 'react';

interface ArtistSignUpLayoutProps {
  children: React.ReactNode;
}

const ArtistSignUpLayout = ({ children }: ArtistSignUpLayoutProps) => {
  return (
    <div className="w-full flex min-h-screen">
      {children}
    </div>
  );
};

export default ArtistSignUpLayout;
