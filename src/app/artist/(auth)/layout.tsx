import React from 'react';

interface ArtistAuthLayoutProps {
  children: React.ReactNode;
}

const ArtistAuthLayout = ({ children }: ArtistAuthLayoutProps) => {
  return (
    <div className="w-full bg-background">
      {children}
    </div>
  );
};

export default ArtistAuthLayout;
