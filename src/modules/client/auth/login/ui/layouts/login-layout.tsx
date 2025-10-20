import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {children}
    </div>
  );
};

export default LoginLayout;