import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import MyRequestsSection from "@/modules/client/profile/ui/sections/my-requests/my-requests-section";

export default function MyRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <Link
          href="/profile"
          className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
        >
          <ArrowLeftIcon className="w-4" /> Back to Profile
        </Link>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">View and manage all your service requests.</p>
      <MyRequestsSection />
    </div>
  );
}
