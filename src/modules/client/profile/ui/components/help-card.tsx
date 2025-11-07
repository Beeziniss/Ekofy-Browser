import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HelpCardProps {
  className?: string;
}

export default function HelpCard({ className }: HelpCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-col items-center gap-3 space-y-0">
        <HelpCircle className="text-white-500 size-7" />
        <CardTitle className="text-base">Something is wrong?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Notice an error in your profile or documents? Contact our support team for assistance.
        </p>
      </CardContent>
    </Card>
  );
}
