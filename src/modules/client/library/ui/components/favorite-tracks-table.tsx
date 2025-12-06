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
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PauseIcon,
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
import { Track, useAudioStore } from "@/store";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useFavoriteTrack } from "@/modules/client/track/hooks/use-favorite-track";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PauseButtonMedium, PlayButtonMedium } from "@/assets/icons";

export interface FavoriteTrack {
  id: string;
  name: string;
  coverImage: string;
  artist: string;
  addedTime: string;
}

interface FavoriteTracksTableProps {
  tracks: FavoriteTrack[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const FavoriteTracksTable = ({ tracks, totalCount, currentPage, pageSize, onPageChange }: FavoriteTracksTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilterDebounced] = useDebounce(globalFilter, 300);
  const { handleFavorite } = useFavoriteTrack();

  const {
    currentTrack,
    isPlaying: globalIsPlaying,
    currentPlaylistId,
    togglePlayPause,
    play,
    setPlaylist,
    skipToTrack,
  } = useAudioStore();

  // Convert favorite tracks to Track format for the store
  const convertToTrackFormat = (favoriteTracks: FavoriteTrack[]): Track[] => {
    return favoriteTracks.map((track) => ({
      id: track.id,
      name: track.name || "Unknown Track",
      artist: track.artist,
      coverImage: track.coverImage,
    }));
  };

  // Check if favorites playlist is currently active and playing
  const isFavoritesActive = currentPlaylistId === "favorites";
  const isFavoritesPlaying = isFavoritesActive && globalIsPlaying;

  // Handle main Play/Pause button click
  const handleMainPlayPause = () => {
    if (tracks.length === 0) return;

    if (isFavoritesActive) {
      // If favorites is active, just toggle play/pause
      togglePlayPause();
    } else {
      // If favorites is not active, set up the playlist and play from the first track
      const tracksForQueue = convertToTrackFormat(tracks);
      setPlaylist(tracksForQueue, "favorites");
      play();
    }
  };

  const formatAddedTime = (addedTime: string) => {
    return new Date(addedTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns: ColumnDef<FavoriteTrack>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "TRACK",
        cell: ({ row }) => {
          const track = row.original;
          // Check if this is the currently playing track AND favorites is active
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavoritesActive = currentPlaylistId === "favorites";
          const isCurrentlyPlaying = isCurrentTrack && isFavoritesActive && globalIsPlaying;

          // Handle play/pause click
          const handlePlayPauseClick = (e: React.MouseEvent) => {
            e.preventDefault();

            if (isCurrentTrack && isFavoritesActive) {
              // If it's the current track from favorites, toggle play/pause
              togglePlayPause();
            } else {
              // Convert all tracks and set up favorites context
              const tracksForQueue = convertToTrackFormat(tracks);

              // Find the index of the clicked track
              const trackIndex = tracksForQueue.findIndex((t) => t.id === track.id);

              if (trackIndex !== -1) {
                if (isFavoritesActive) {
                  // If favorites is already active, just skip to the track
                  skipToTrack(trackIndex);
                  play();
                } else {
                  // Set the entire favorites playlist with "favorites" as playlist ID
                  setPlaylist(tracksForQueue, "favorites");

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
                  className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 ${isCurrentlyPlaying ? "opacity-100" : ""}`}
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
                </div>
              </div>
            </div>
          );
        },
        enableSorting: true,
        filterFn: "includesString",
      },
      {
        accessorKey: "artist",
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

          const handleCopyLink = () => {
            if (track.id) {
              const url = `${window.location.origin}/track/${track.id}`;
              navigator.clipboard.writeText(url);
              toast.success("Copied!");
            }
          };

          const handleRemoveFromFavorites = () => {
            handleFavorite({
              id: track.id,
              name: track.name,
              checkTrackInFavorite: true, // Setting to true since we want to remove (isAdding will be false)
            });
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
                <DropdownMenuItem className="cursor-pointer" onClick={handleCopyLink}>
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share Track
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-400" onClick={handleRemoveFromFavorites}>
                  <HeartIcon className="mr-2 h-4 w-4" />
                  Remove from Favorites
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
      },
    ],
    [
      currentTrack?.id,
      currentPlaylistId,
      globalIsPlaying,
      togglePlayPause,
      tracks,
      skipToTrack,
      play,
      setPlaylist,
      handleFavorite,
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

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="w-full space-y-4">
      {/* Header with Play/Pause button and Search Box */}
      <div className="flex items-center justify-between gap-4">
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="iconLg"
          onClick={handleMainPlayPause}
          disabled={tracks.length === 0}
          className="text-main-white mt-auto duration-0 hover:brightness-90"
        >
          {isFavoritesPlaying ? <PauseButtonMedium className="size-12" /> : <PlayButtonMedium className="size-12" />}
        </Button>

        {/* Search Box */}
        <div className="relative w-80">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search favorite tracks..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Results info */}
      {totalCount > 0 && (
        <div className="text-sm text-gray-400">
          Showing {startItem}-{endItem} of {totalCount} favorite tracks
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex items-center">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`text-main-white ${header.column.id === "name" ? "flex-1" : ""} ${header.column.id === "artist" ? "w-[20%]" : ""} ${header.column.id === "addedTime" ? "w-25" : ""} ${header.column.id === "actions" ? "w-14" : ""} flex items-center`}
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="group flex items-center">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-3 ${cell.column.id === "name" ? "flex-1" : ""} ${
                      cell.column.id === "artist" ? "w-[20%]" : ""
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
                      ? "No favorite tracks found matching your search."
                      : "You haven't added any tracks to your favorites yet. Explore and find tracks you love!"}
                  </div>
                  <Button>Explore tracks</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}
              {renderPaginationItems()}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default FavoriteTracksTable;
