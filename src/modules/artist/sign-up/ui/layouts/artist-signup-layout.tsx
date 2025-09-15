import React from 'react';

interface ArtistSignUpLayoutProps {
  children: React.ReactNode;
}

const ArtistSignUpLayout = ({ children }: ArtistSignUpLayoutProps) => {
  return (
    <div className="w-full flex">
      {children}
    </div>
  );
};

export default ArtistSignUpLayout;
