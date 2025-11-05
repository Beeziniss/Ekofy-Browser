"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

const UnauthenticatedMessage = () => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in required</CardTitle>
          <CardDescription className="text-base">
            You need to sign in or create an account to access your library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              <Link href="/login" className="flex items-center justify-center">
                <LogInIcon className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link
                href="/sign-up"
                className="flex items-center justify-center"
              >
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthenticatedMessage;
