"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtistsPickProps {
  onAdd?: () => void;
}

export default function ArtistsPick({ onAdd }: ArtistsPickProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold">Artist&#39;s Pick</h2>

      <div className="mt-4 flex items-center gap-4">
        {/* Add square */}
        <Button
          type="button"
          variant="outline"
          size="iconLg"
          onClick={onAdd}
          aria-label="Add artist pick"
          className="group size-24 rounded-md border-dashed md:size-28"
        >
          <Plus className="text-muted-foreground group-hover:text-foreground size-8" />
        </Button>

        {/* Helper text */}
        <p className="text-muted-foreground text-sm">
          Feature any album, track, or playlist at the top of your profile.
        </p>
      </div>
    </div>
  );
}
