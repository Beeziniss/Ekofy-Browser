"use client";
import { useArtistProfile } from "../../../hooks/use-artist-profile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { execute } from "@/gql/execute";
import { UpdateArtistProfileMutation } from "../../views/queries";
import { useAuthStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { artistProfileOptions } from "@/gql/options/artist-options";
import { toast } from "sonner";

export default function BiographySection() {
  const { biography } = useArtistProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const { user } = useAuthStore();
  const userId = user?.userId || "";
  const qc = useQueryClient();

  useEffect(() => {
    setValue(biography || "");
  }, [biography]);

  const onSave = async () => {
    try {
      await execute(UpdateArtistProfileMutation, {
        updateArtistRequest: { biography: value.trim() || null },
      });
      toast.success("Your biography has been updated.");
      await qc.invalidateQueries({ queryKey: artistProfileOptions(userId).queryKey });
      setIsEditing(false);
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      const msg = /401|Unauthorized/i.test(raw)
        ? "You’re not authorized. Please sign in and try again."
        : /403|AUTH_NOT_AUTHORIZED/i.test(raw)
          ? "You don’t have permission to update this profile."
          : /Network Error/i.test(raw)
            ? "Network issue while updating your biography. Please check your connection and retry."
            : "Couldn’t update your biography right now. Please try again in a moment.";
      console.error("Biography update failed:", raw);
      toast.error(msg);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Biography</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : null}
      </div>

      {!isEditing ? (
        <p className="text-muted-foreground mt-3 text-sm leading-6 whitespace-pre-wrap">
          {biography || "No biography provided yet."}
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a short biography..."
            rows={6}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setValue(biography || "");
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
