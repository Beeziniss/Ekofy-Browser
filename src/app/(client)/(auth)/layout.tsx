import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const Layout= ({ children }: AuthLayoutProps) => {
  return (
    <div className="w-full bg-background">
      {children}
    </div>
  );
};

export default Layout;
