import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpCardProps {
  className?: string;
}

export default function HelpCard({ className }: HelpCardProps) {
  return (
    <Card className={cn("w-full ", className)}>
      <CardHeader className="flex flex-col items-center gap-3 space-y-0">
        <HelpCircle className="size-7 text-white-500" />
        <CardTitle className="text-base">Something is wrong?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Notice an error in your profile or documents? Contact our support team for assistance.
        </p>
      </CardContent>
    </Card>
  );
}
