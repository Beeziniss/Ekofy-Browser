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
        <h1 className="text-4xl font-semibold">You&apos;ve cancelled your subscription.</h1>
        <p className="text-main-white/70 text-base">
          We&apos;re sorry to see you go! If you change your mind, you can always resubscribe to enjoy our premium
          features.
        </p>
      </div>
    </div>
  );
};

export default Page;
