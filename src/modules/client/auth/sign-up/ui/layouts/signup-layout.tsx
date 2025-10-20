import React from 'react';

interface SignUpLayoutProps {
  children: React.ReactNode;
}

const SignUpLayout = ({ children }: SignUpLayoutProps) => {
  return (
    <div className="w-full flex">
      {children}
    </div>
  );
};

export default SignUpLayout;