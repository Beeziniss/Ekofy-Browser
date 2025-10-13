import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoreInfoCardProps {
  className?: string;
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M41.5 16.6c-3.9-.9-7.3-3.2-9.6-6.5V29c0 6.4-5.2 11.6-11.6 11.6S8.7 35.4 8.7 29s5.2-11.6 11.6-11.6c.8 0 1.6.1 2.4.3v6.5c-.8-.3-1.6-.4-2.4-.4-3.6 0-6.6 3-6.6 6.6s3 6.6 6.6 6.6 6.6-3 6.6-6.6V6.4h6.5c1.9 3.8 5.4 6.6 9.6 7.5v6.7z" />
    </svg>
  );
}

export default function MoreInfoCard({ className }: MoreInfoCardProps) {
  const items = [
    { label: "Instagram", Icon: Instagram },
    { label: "Facebook", Icon: Facebook },
    { label: "X", Icon: Twitter }, // Using Twitter icon for X
    { label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">More info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {items.map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="size-5 text-muted-foreground" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
