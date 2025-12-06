import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
};
