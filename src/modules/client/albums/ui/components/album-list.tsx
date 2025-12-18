import { InfiniteData } from "@tanstack/react-query";
import { AlbumsQuery } from "@/gql/graphql";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface AlbumListProps {
  data: InfiniteData<AlbumsQuery>;
}

const AlbumList = ({ data }: AlbumListProps) => {
  const albums = data.pages.flatMap((page) => page.albums?.items ?? []);

  if (albums.length === 0) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <p className="text-muted-foreground text-lg">No albums found</p>
      </div>
    );
  }

  return (
    <>
      {albums.map((album) => (
        <div key={album.id} className="flex w-full flex-col space-y-2.5">
          <Link
            key={album?.id}
            href={`/albums/${album.id}`}
            className="group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:opacity-0 after:content-[''] hover:after:opacity-20"
          >
            {album?.coverImage ? (
              <Image
                src={album.coverImage}
                alt={album.name || "Album cover"}
                className="aspect-square h-full w-full rounded-md object-cover"
                width={300}
                height={300}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-main-white/50 text-4xl">🎵</span>
              </div>
            )}
          </Link>

          <div className="flex flex-col gap-y-1">
            <Link
              href={`/albums/${album.id}`}
              className="text-main-white hover:text-main-purple truncate text-sm font-medium hover:underline"
            >
              {album?.name}
            </Link>
            {album?.description && (
              <p className="text-main-white/60 truncate text-xs">{album.isVisible ? "Public" : "Private"}</p>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default AlbumList;
