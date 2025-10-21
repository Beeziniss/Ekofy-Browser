import React from "react";
import PlaylistManagementModal from "./playlist-management-modal";

// Example usage of the PlaylistManagementModal with cover image upload
const ExampleUsage: React.FC = () => {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  // Example playlist data with uploaded cover image
  const samplePlaylistWithCover = {
    id: "playlist-123",
    name: "My Awesome Playlist",
    description: "A collection of my favorite songs",
    isPublic: true,
    coverImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg", // Example Cloudinary image
  };

  return (
    <div className="space-y-4 p-8">
      <h2 className="mb-4 text-2xl font-bold">
        Playlist Management Modal with Cover Upload
      </h2>

      <div className="space-x-4">
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Create New Playlist
        </button>

        <button
          onClick={() => setEditOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit Playlist with Cover
        </button>
      </div>

      {/* Create mode */}
      <PlaylistManagementModal
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          console.log("Playlist created successfully!");
        }}
      />

      {/* Edit mode with existing cover image - This should now display the cover correctly */}
      <PlaylistManagementModal
        mode="edit"
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={samplePlaylistWithCover}
        onSuccess={() => {
          console.log("Playlist updated successfully!");
        }}
      />
    </div>
  );
};

export default ExampleUsage;
