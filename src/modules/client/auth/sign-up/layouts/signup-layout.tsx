import React from 'react';

interface SignUpLayoutProps {
  children: React.ReactNode;
}

const SignUpLayout = ({ children }: SignUpLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {children}
    </div>
  );
};

export default SignUpLayout;