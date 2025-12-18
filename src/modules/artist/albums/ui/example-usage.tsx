/**
 * Example usage of AlbumCreate component
 *
 * This is an example showing how to use the AlbumCreate component
 * in an artist's studio or albums page.
 */

"use client";

import { AlbumCreate } from "./components";

export default function AlbumManagementExample() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Albums</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Existing albums would be mapped here */}

        {/* Album Create Component */}
        <AlbumCreate />
      </div>
    </div>
  );
}

