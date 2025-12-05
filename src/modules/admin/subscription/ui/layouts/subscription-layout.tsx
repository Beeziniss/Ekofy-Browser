import { ReactNode } from "react";

interface SubscriptionLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showCard?: boolean;
}

export function SubscriptionLayout({
  children,
  title = "Subscription Management",
  description = "Manage subscriptions and plans for your platform",
  showCard = true,
}: SubscriptionLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-6 lg:p-8">
        {(title || description) && (
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        )}

        {showCard ? (
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
            <div className="p-4 md:p-6">{children}</div>
          </div>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    </div>
  );
}