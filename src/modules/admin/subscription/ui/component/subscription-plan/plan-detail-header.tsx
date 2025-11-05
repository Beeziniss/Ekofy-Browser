import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface PlanDetailHeaderProps {
  subscriptionId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PlanDetailHeader({ 
  subscriptionId, 
  onEdit, 
  onDelete 
}: PlanDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/subscription/${subscriptionId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}