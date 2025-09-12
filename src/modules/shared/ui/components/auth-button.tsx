import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AuthButton = () => {
  return (
    <>
      {/* Signed in */}
      <div className="flex items-center gap-x-4"></div>
      {/* Signed out */}
      <div className="font-bepro flex items-center gap-x-4">
        <Link href={"/"} className="hover:underline">
          <span className="text-sm font-medium">Sign In</span>
        </Link>
        <Link href={"/"}>
          <Button className="primary_gradient font-semibold text-white hover:brightness-90">
            Create Account
          </Button>
        </Link>
      </div>
    </>
  );
};

export default AuthButton;
