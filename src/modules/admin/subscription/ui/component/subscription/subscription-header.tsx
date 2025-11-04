import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface SubscriptionHeaderProps {
  subscription: {
    id: string;
    name: string;
    description?: string | null;
    code: string;
    tier: string;
    status: string;
  };
  onBack?: () => void;
}

export function SubscriptionHeader({ onBack }: SubscriptionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      <Button variant="outline">
        <Edit className="mr-2 h-4 w-4" />
        Edit Subscription
      </Button>
    </div>
  );
}