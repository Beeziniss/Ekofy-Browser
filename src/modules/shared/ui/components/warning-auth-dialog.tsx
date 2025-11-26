"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { EkofyLogoTextLg } from "@/assets/icons";

interface WarningAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action:
    | "play"
    | "favorite"
    | "comment"
    | "follow"
    | "playlist"
    | "apply"
    | "contact"
    | "reply"
    | "post"
    | "edit"
    | "chat";
  trackName?: string;
}

export function WarningAuthDialog({ open, onOpenChange, action, trackName }: WarningAuthDialogProps) {
  const getActionText = () => {
    switch (action) {
      case "play":
        return "play music";
      case "favorite":
        return "save tracks to your favorites";
      case "comment":
        return "join a conversation";
      case "follow":
        return "follow artists";
      case "playlist":
        return "add track to your playlist";
      case "apply":
        return "apply for requests";
      case "contact":
        return "contact clients";
      case "reply":
        return "reply to comments";
      case "post":
        return "post requests";
      case "edit":
        return "edit your content";
      case "chat":
        return "chat with artists";
      default:
        return "use this feature";
    }
  };

  const getTitle = () => {
    switch (action) {
      case "play":
        return "Sign up to start listening";
      case "favorite":
        return "Sign up to save your favorites";
      case "comment":
        return "Sign up to join the conversation";
      case "follow":
        return "Sign up to follow artists";
      case "playlist":
        return "Sign up to add track to your playlist";
      case "apply":
        return "Sign up to apply for requests";
      case "contact":
        return "Sign up to contact clients";
      case "reply":
        return "Sign up to reply to comments";
      case "post":
        return "Sign up to post requests";
      case "edit":
        return "Sign up to edit your content";
      case "chat":
        return "Sign up to chat with artists";
      default:
        return "Sign up to continue";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-700 bg-gradient-to-br from-gray-900 to-black sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <EkofyLogoTextLg className="w-60 text-white" />
            </div>
          </div>

          <DialogTitle className="mb-2 text-xl font-bold text-white">{getTitle()}</DialogTitle>

          <DialogDescription className="text-gray-300">
            {trackName ? (
              <>
                To {getActionText()}
                <strong>{action === "play" ? ` "${trackName}"` : ""}</strong>, you&apos;ll need to create a free Ekofy
                account first.
              </>
            ) : (
              <>To {getActionText()}, you&apos;ll need to create a free Ekofy account first.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-white">
              <Image src="/ekofy-logo-xs.svg" alt="Ekofy" width={20} height={20} className="h-5 w-5" />
              Join Ekofy for free and get:
            </h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                Unlimited music streaming
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                Create and save playlists
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                Follow your favorite artists
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                Discover new music daily
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-4">
            <Link href="/sign-up" className="w-full" onClick={() => onOpenChange(false)}>
              <Button className="h-11 w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white hover:from-blue-700 hover:to-purple-700">
                Create free account
              </Button>
            </Link>

            <div className="text-center">
              <span className="text-sm text-gray-400">Already have an account? </span>
              <Link
                href="/login"
                className="text-sm font-medium text-purple-400 underline hover:text-purple-300"
                onClick={() => onOpenChange(false)}
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Not now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
