"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Music, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EkofyLogoTextLg } from "@/assets/icons";
import Link from "next/link";

const WelcomeView = () => {
  const router = useRouter();

  const handleArtistClick = () => {
    router.push("/artist/login");
  };

  const handleListenerClick = () => {
    router.push("/login");
  };

  return (
    <div className="bg-main-dark-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href={"/landing"}>
            <EkofyLogoTextLg className="mx-auto mb-6 w-42 text-white" />
          </Link>
          <h1 className="text-main-white mb-3 text-4xl font-bold">Welcome to Ekofy</h1>
          <p className="text-main-grey text-lg">Choose how you want to experience music</p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Artist Card */}
          <div
            onClick={handleArtistClick}
            className="group bg-main-dark-bg-1 hover:border-main-blue/50 cursor-pointer rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,84,234,0.3)]"
          >
            <div className="mb-6 flex justify-center">
              <div className="bg-main-blue/20 flex size-20 items-center justify-center rounded-2xl">
                <Music className="text-main-blue size-10" />
              </div>
            </div>

            <h2 className="text-main-white mb-4 text-center text-2xl font-bold">I&apos;m an Artist</h2>

            <p className="text-main-grey mb-6 text-center">
              Share your music with the world. Upload tracks, manage your portfolio, and connect with fans.
            </p>

            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-main-blue mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Upload unlimited tracks</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-main-blue mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Manage your music portfolio</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-main-blue mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Track your audience analytics</span>
              </li>
            </ul>

            <Button className="group/btn bg-main-blue hover:bg-main-blue/90 w-full font-semibold text-white">
              Continue as Artist
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>

          {/* Listener Card */}
          <div
            onClick={handleListenerClick}
            className="group bg-main-dark-bg-1 hover:border-main-purple/50 cursor-pointer rounded-3xl border border-white/10 p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(171,78,229,0.3)]"
          >
            <div className="mb-6 flex justify-center">
              <div className="bg-main-purple/20 flex size-20 items-center justify-center rounded-2xl">
                <Headphones className="text-main-purple size-10" />
              </div>
            </div>

            <h2 className="text-main-white mb-4 text-center text-2xl font-bold">I&apos;m a Listener</h2>

            <p className="text-main-grey mb-6 text-center">
              Discover amazing music. Create playlists, follow your favorite artists, and enjoy unlimited streaming.
            </p>

            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-main-purple mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Stream unlimited music</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-main-purple mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Create custom playlists</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-main-purple mt-1 size-1.5 shrink-0 rounded-full" />
                <span className="text-main-grey text-sm">Follow your favorite artists</span>
              </li>
            </ul>

            <Button className="group/btn bg-main-purple hover:bg-main-purple/90 w-full font-semibold text-white">
              Continue as Listener
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
