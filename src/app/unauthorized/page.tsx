"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
          <ShieldX className="h-10 w-10 text-purple-600" />
        </div>

        {/* Error Code */}
        <h1 className="mb-2 text-6xl font-bold text-purple-600">403</h1>

        {/* Error Title */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Access Forbidden</h2>

        {/* Error Description */}
        <p className="mb-8 leading-relaxed text-gray-600">
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

          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
