"use client";

import Link from "next/link";
import { ShieldX, Home } from "lucide-react";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900/80 p-8 text-center shadow-xl backdrop-blur-sm">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-900/50">
          <ShieldX className="h-10 w-10 text-purple-400" />
        </div>

        {/* Error Code */}
        <h1 className="mb-2 text-6xl font-bold text-purple-400">403</h1>

        {/* Error Title */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-100">Access Forbidden</h2>

        {/* Error Description */}
        <p className="mb-8 leading-relaxed text-gray-400">
          You don&apos;t have permission to access this page. This area is restricted and requires specific
          authorization.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-purple-700"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-500">If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
