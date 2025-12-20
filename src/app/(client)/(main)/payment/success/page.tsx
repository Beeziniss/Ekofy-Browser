"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, CircleStarIcon, Home } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="flex h-[calc(100vh-112px)] items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <Card className="w-full max-w-2xl border-gray-800 bg-gray-900/50 shadow-2xl backdrop-blur">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 ring-4 ring-green-500/20">
              <CheckCircle2 className="h-16 w-16 text-green-500" strokeWidth={2} />
            </div>

            {/* Success Message */}
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Payment Successful!</h1>
            <p className="mb-8 max-w-md text-lg text-gray-400">
              Your payment has been processed successfully. Thank you for your order! You can now track your order
              progress or return to the homepage.
            </p>

            {/* Decorative Line */}
            <div className="via-main-purple mb-8 h-px w-32 bg-gradient-to-r from-transparent to-transparent"></div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="ekofy"
                size="lg"
                className="flex-1 gap-2 sm:flex-initial sm:px-8"
                onClick={() => {
                  if (user?.userId) {
                    router.push(`/activities/conversation/${user.userId}`);
                  } else {
                    router.push("/activities/conversation");
                  }
                }}
              >
                <CircleStarIcon className="h-5 w-5" />
                View Orders
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2 border-gray-700 bg-gray-800/50 text-white hover:bg-gray-800 sm:flex-initial sm:px-8"
                asChild
              >
                <Link href="/">
                  <Home className="h-5 w-5" />
                  Go to Homepage
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <p className="mt-8 text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
