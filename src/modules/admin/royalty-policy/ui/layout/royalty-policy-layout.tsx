import { ReactNode } from "react";

interface RoyaltyPolicyLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function RoyaltyPolicyLayout({
  children,
  title = "Royalty Policy Management",
  description = "Manage royalty policies for stream payments and revenue distribution",
}: RoyaltyPolicyLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-6 lg:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <div>
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
