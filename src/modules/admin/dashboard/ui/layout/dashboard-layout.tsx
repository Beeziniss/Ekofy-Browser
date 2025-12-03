import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({
  children,
  title = "Admin Dashboard",
  description = "Overview of system metrics and transactions",
}: DashboardLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="flex-1 space-y-6 p-4 pt-6 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
