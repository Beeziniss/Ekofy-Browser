import React from "react";

interface AdminLoginLayoutProps {
  children: React.ReactNode;
}

const AdminLoginLayout = ({ children }: AdminLoginLayoutProps) => {
  return <div className="flex min-h-screen w-full">{children}</div>;
};

export default AdminLoginLayout;
