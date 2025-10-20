import React from 'react';

interface ArtistLoginLayoutProps {
  children: React.ReactNode;
}

const ArtistLoginLayout = ({ children }: ArtistLoginLayoutProps) => {
  return (
    <div className="w-full flex">
      {children}
    </div>
  );
};

export default ArtistLoginLayout;
