import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderDetailLayoutProps {
  children: ReactNode;
}

export function OrderDetailLayout({ children }: OrderDetailLayoutProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/moderator/order-disputed">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Disputed Orders
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-100">Order Details</h1>
        <p className="text-sm text-gray-400">Review and resolve the disputed order</p>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
