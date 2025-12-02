import { ReactNode } from "react";

interface EscrowPolicyLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function EscrowPolicyLayout({
  children,
  title = "Escrow Commission Policy Management",
  description = "Manage escrow commission policies for platform fees and revenue distribution",
}: EscrowPolicyLayoutProps) {
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
