"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EllipsisVerticalIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  Trash2Icon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PauseIcon,
  PlusIcon,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import PlaylistRemoveTrackModal from "./playlist-remove-track-modal";
import PlaylistAddTrackDrawer from "./playlist-add-track-drawer";
import { Track, useAudioStore } from "@/store";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export interface PlaylistTrack {
  id: string;
  name: string;
  coverImage: string;
  isExplicit: boolean;
  artist: string;
  addedTime: string;
}

interface PlaylistTrackTableProps {
  tracks: PlaylistTrack[];
  playlistId: string;
  playlistName: string;
}

const PlaylistTrackTable = ({ tracks, playlistId, playlistName }: PlaylistTrackTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [removeTrackModal, setRemoveTrackModal] = useState<{
    open: boolean;
    trackId: string;
    trackName: string;
  }>({
    open: false,
    trackId: "",
    trackName: "",
  });
  const [addTrackDrawerOpen, setAddTrackDrawerOpen] = useState(false);

  const [globalFilterDebounced] = useDebounce(globalFilter, 300);

  const {
    currentTrack,
    isPlaying: globalIsPlaying,
    currentPlaylistId,
    togglePlayPause,
    play,
    setPlaylist,
    skipToTrack,
  } = useAudioStore();

  const formatAddedTime = (addedTime: string) => {
    /* const date = new Date(addedTime);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`; */

    return new Date(addedTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns: ColumnDef<PlaylistTrack>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "TRACK",
        cell: ({ row }) => {
          const track = row.original;
          // Check if this is the currently playing track AND this playlist is active
          const isCurrentTrack = currentTrack?.id === track.id;
          const isPlaylistActive = currentPlaylistId === playlistId;
          const isCurrentlyPlaying = isCurrentTrack && isPlaylistActive && globalIsPlaying;

          // Convert playlist tracks to Track format for the store
          const convertToTrackFormat = (playlistTracks: PlaylistTrack[]): Track[] => {
            return playlistTracks.map((track) => ({
              id: track.id,
              name: track.name || "Unknown Track",
              artist: track.artist,
              coverImage: track.coverImage,
            }));
          };

          // Handle play/pause click
          const handlePlayPauseClick = (e: React.MouseEvent) => {
            e.preventDefault();

            if (isCurrentTrack && isPlaylistActive) {
              // If it's the current track from this playlist, toggle play/pause
              togglePlayPause();
            } else {
              // Convert all tracks and set up playlist context
              const tracksForQueue = convertToTrackFormat(tracks);

              // Find the index of the clicked track
              const trackIndex = tracksForQueue.findIndex((t) => t.id === track.id);

              if (trackIndex !== -1) {
                if (isPlaylistActive) {
                  // If this playlist is already active, just skip to the track
                  skipToTrack(trackIndex);
                  play();
                } else {
                  // Set the entire playlist with the correct playlist ID and track
                  setPlaylist(tracksForQueue, playlistId);

                  // If it's not the first track, skip to the clicked track
                  if (trackIndex !== 0) {
                    setTimeout(() => skipToTrack(trackIndex), 0);
                  }

                  play();
                }
              }
            }
          };
          return (
            <div className="flex items-center gap-3">
              <div className="relative">
                {track.coverImage ? (
                  <Image
                    src={track.coverImage}
                    alt={track.name || "Cover"}
                    width={48}
                    height={48}
                    className="size-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="primary_gradient size-12 rounded-md" />
                )}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 ${isCurrentlyPlaying ? "opacity-100" : ""}`}
                  onClick={handlePlayPauseClick}
                >
                  {isCurrentlyPlaying ? (
                    <PauseIcon className="h-5 w-5 fill-white text-white" />
                  ) : (
                    <PlayIcon className="h-5 w-5 fill-white text-white" />
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`truncate font-medium ${isCurrentlyPlaying ? "text-main-purple" : "text-white"}`}>
                    {track.name}
                  </span>
                  {track.isExplicit && <span className="rounded bg-gray-600 px-1.5 py-0.5 text-xs text-white">E</span>}
                </div>
              </div>
            </div>
          );
        },
        enableSorting: true,
        filterFn: "includesString",
      },
      {
        accessorKey: "stageName",
        header: "ARTIST",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-gray-300 transition-colors hover:text-white">
            {row.original.artist || "Unknown Artist"}
          </span>
        ),
        enableSorting: true,
        filterFn: "includesString",
      },
      {
        accessorKey: "addedTime",
        header: "ADDED",
        cell: ({ row }) => <span className="text-sm text-gray-400">{formatAddedTime(row.original.addedTime)}</span>,
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.addedTime);
          const dateB = new Date(rowB.original.addedTime);
          return dateA.getTime() - dateB.getTime();
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const track = row.original;

          const handleRemoveFromPlaylist = () => {
            setRemoveTrackModal({
              open: true,
              trackId: track.id,
              trackName: track.name,
            });
          };

          const handleCopyLink = () => {
            if (track.id) {
              const url = `${window.location.origin}/track/${track.id}`;
              navigator.clipboard.writeText(url);
              toast.success("Copied!");
            }
          };

          const handlePlayNow = () => {
            const tracksForQueue = tracks.map((t) => ({
              id: t.id,
              name: t.name || "Unknown Track",
              artist: t.artist,
              coverImage: t.coverImage,
            }));

            const trackIndex = tracksForQueue.findIndex((t) => t.id === track.id);

            if (trackIndex !== -1) {
              if (currentPlaylistId === playlistId) {
                // If this playlist is already active, just skip to the track
                skipToTrack(trackIndex);
              } else {
                // Set the entire playlist with the correct playlist ID and track
                setPlaylist(tracksForQueue, playlistId);

                // If it's not the first track, skip to the clicked track
                if (trackIndex !== 0) {
                  setTimeout(() => skipToTrack(trackIndex), 0);
                }
              }

              play();
            }
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={handlePlayNow}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Play Now
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <HeartIcon className="mr-2 h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleCopyLink}>
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share Track
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-400" onClick={handleRemoveFromPlaylist}>
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Remove from Playlist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
      },
    ],
    [
      currentTrack,
      globalIsPlaying,
      currentPlaylistId,
      playlistId,
      tracks,
      // Functions from Zustand are stable references
      play,
      setPlaylist,
      skipToTrack,
      togglePlayPause,
    ],
  );

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter: globalFilterDebounced,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search Box */}
      <div className="relative w-80">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search tracks..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex items-center">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`text-main-white ${header.column.id === "name" ? "flex-1" : ""} ${header.column.id === "stageName" ? "w-[15%]" : ""} ${header.column.id === "addedTime" ? "w-25" : ""} ${header.column.id === "actions" ? "w-14" : ""} flex items-center`}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "hover:text-main-purple text-main-white flex cursor-pointer items-center gap-2 select-none hover:underline"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUpIcon className="text-main-white size-5" />,
                        desc: <ChevronDownIcon className="text-main-white size-5" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <TableRow
            className="hover:bg-muted/50 flex cursor-pointer items-center gap-x-3 px-2 py-3 transition-colors"
            onClick={() => setAddTrackDrawerOpen(true)}
          >
            <TableCell className="bg-main-grey-dark-bg flex size-12 items-center justify-center">
              <PlusIcon className="text-main-white size-6" />
            </TableCell>
            <td className="text-main-white flex-1">Add new track</td>
          </TableRow>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="group flex items-center">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-3 ${cell.column.id === "name" ? "flex-1" : ""} ${
                      cell.column.id === "stageName" ? "w-[15%]" : ""
                    } ${cell.column.id === "addedTime" ? "w-25" : ""} ${cell.column.id === "actions" ? "w-14" : ""}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={columns.length} className="w-full py-4 text-center">
                <div className="text-main-white flex flex-col items-center gap-y-3 font-normal">
                  <div className="text-lg">
                    {globalFilter
                      ? "No tracks found matching your search."
                      : "This playlist looks empty... Find some tracks to add to your playlist."}
                  </div>
                  <Button>Explore tracks</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PlaylistRemoveTrackModal
        open={removeTrackModal.open}
        onOpenChange={(open) => setRemoveTrackModal((prev) => ({ ...prev, open }))}
        playlistId={playlistId}
        trackId={removeTrackModal.trackId}
        trackName={removeTrackModal.trackName}
        onSuccess={() => setRemoveTrackModal({ open: false, trackId: "", trackName: "" })}
      />

      <PlaylistAddTrackDrawer
        open={addTrackDrawerOpen}
        onOpenChange={setAddTrackDrawerOpen}
        playlistId={playlistId}
        playlistName={playlistName}
      />
    </div>
  );
};

export default PlaylistTrackTable;
