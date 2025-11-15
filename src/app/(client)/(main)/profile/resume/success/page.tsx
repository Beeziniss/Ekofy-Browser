import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col space-y-6">
        <Link
          href="/profile"
          className="text-main-white hover:border-main-white flex w-fit items-center gap-x-2 border-b border-transparent pb-0.5 text-sm transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to profile
        </Link>
        <h1 className="text-4xl font-semibold">Your subscription has been resumed!</h1>
        <p className="text-main-white/70 text-base">
          Welcome back! Your premium subscription is now active and you can continue enjoying all our premium features.
        </p>
      </div>
    </div>
  );
};

export default Page;
