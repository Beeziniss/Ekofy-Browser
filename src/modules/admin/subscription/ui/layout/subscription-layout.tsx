import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SubscriptionLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function SubscriptionLayout({ 
  children, 
  title = "Subscription Management",
  description = "Manage subscriptions and plans for your platform" 
}: SubscriptionLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}