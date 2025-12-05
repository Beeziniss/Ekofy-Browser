"use client";

import { useAuthStore } from "@/store";
import PlaylistSection from "../sections/playlist-section";

const LibraryView = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full">
      <PlaylistSection userId={user!.userId} />
    </div>
  );
};

export default LibraryView;
