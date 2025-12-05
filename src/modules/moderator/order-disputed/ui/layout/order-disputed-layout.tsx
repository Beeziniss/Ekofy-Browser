import { ReactNode } from "react";

interface OrderDisputedLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function OrderDisputedLayout({ title, description, children }: OrderDisputedLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">{title}</h1>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
