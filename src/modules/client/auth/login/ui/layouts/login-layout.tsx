import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return <div className="bg-background flex min-h-screen">{children}</div>;
};

export default LoginLayout;
