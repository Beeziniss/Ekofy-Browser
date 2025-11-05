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
  showCard = true
}: SubscriptionLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8 pt-6">
        {(title || description) && (
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        )}
        
        {showCard ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 md:p-6">
              {children}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}