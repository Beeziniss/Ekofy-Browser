"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  Heart, 
  // Album, 
  // Share,
  Search,
  Eye,
  CheckIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchTrackItem } from '@/types/search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  playlistBriefOptions,
  checkTrackInPlaylistOptions 
} from '@/gql/options/client-options';
import {
  addToPlaylistMutationOptions,
  removeFromPlaylistMutationOptions
} from '@/gql/options/client-mutation-options';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';
import Image from 'next/image';
import { useFavoriteSearch } from '../../hooks/use-favorite-search';
import { useAuthAction } from '@/hooks/use-auth-action';
import { WarningAuthDialog } from '@/modules/shared/ui/components/warning-auth-dialog';

interface TrackActionMenuProps {
  track: SearchTrackItem;
  isVisible?: boolean;
}

export const TrackActionMenu: React.FC<TrackActionMenuProps> = ({
  track,
  // isVisible = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState("");
  const [submenuPosition, setSubmenuPosition] = useState<"right" | "left">("right");
  const [mainMenuPosition, setMainMenuPosition] = useState<"right" | "left">("right");
  const menuRef = useRef<HTMLDivElement>(null);
  const playlistMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  
  // Auth action hooks
  const {
    showWarningDialog,
    setShowWarningDialog,
    warningAction,
    trackName,
    executeWithAuth,
  } = useAuthAction();
  
  // Favorite hooks
  const { handleFavoriteTrack } = useFavoriteSearch();

  // Real playlist data from GraphQL
  const { data: playlistsData, isLoading: isLoadingPlaylists } = useQuery({
    ...playlistBriefOptions(user?.userId || ""),
    enabled: !!user?.userId,
  });

  const { data: trackInPlaylistsData } = useQuery({
    ...checkTrackInPlaylistOptions(track.id),
    enabled: !!user?.userId,
  });

  // Mutations for playlist operations
  const { mutate: addToPlaylist, isPending: isAddingToPlaylist } = useMutation({
    ...addToPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail-tracklist"] });
      queryClient.invalidateQueries({ queryKey: ["check-track-in-playlist", track.id] });
      toast.success("Track added to playlist successfully!");
    },
    onError: (error) => {
      console.error("Failed to add track to playlist:", error);
      toast.error("Failed to add track to playlist. Please try again.");
    },
  });

  const { mutate: removeFromPlaylist, isPending: isRemovingFromPlaylist } = useMutation({
    ...removeFromPlaylistMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-detail"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-detail-tracklist"] });
      queryClient.invalidateQueries({ queryKey: ["check-track-in-playlist", track.id] });
      toast.success("Track removed from playlist successfully!");
    },
    onError: (error) => {
      console.error("Failed to remove track from playlist:", error);
      toast.error("Failed to remove track from playlist. Please try again.");
    },
  });

  // Get playlists and track status
  const playlists = playlistsData?.playlists?.items || [];
  const trackInPlaylistsIds = trackInPlaylistsData?.playlists?.items?.map((p) => p.id) || [];

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()),
  );

  const isPending = isAddingToPlaylist || isRemovingFromPlaylist;

  const isTrackInPlaylist = (playlistId: string) => {
    return trackInPlaylistsIds.includes(playlistId);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    executeWithAuth(() => {
      addToPlaylist({
        playlistId,
        trackId: track.id,
      });
    }, "playlist", track.name);
  };

  const handleRemoveFromPlaylist = (playlistId: string) => {
    executeWithAuth(() => {
      removeFromPlaylist({
        playlistId,
        trackId: track.id,
      });
    }, "playlist", track.name);
  };

  const handleFavoriteClick = () => {
    executeWithAuth(() => {
      handleFavoriteTrack({
        id: track.id,
        name: track.name,
        checkTrackInFavorite: track.checkTrackInFavorite
      });
    }, "favorite", track.name);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsPlaylistMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (isMenuOpen) {
        checkMainMenuPosition();
      }
      if (isPlaylistMenuOpen) {
        checkSubmenuPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen, isPlaylistMenuOpen, mainMenuPosition]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      setTimeout(() => {
        checkMainMenuPosition();
      }, 10);
    } else {
      setIsMenuOpen(false);
    }
    setIsPlaylistMenuOpen(false);
  };

  const checkMainMenuPosition = () => {
    if (menuRef.current) {
      const buttonRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 280;
      const menuHeight = 250; // Estimated menu height

      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      const spaceBelow = viewportHeight - buttonRect.bottom;

      if (spaceRight >= menuWidth + 20) {
        setMainMenuPosition("right");
      } else if (spaceLeft >= menuWidth + 20) {
        setMainMenuPosition("left");
      } else {
        setMainMenuPosition(spaceRight >= spaceLeft ? "right" : "left");
      }

      // Check if menu should appear above when near bottom
      if (spaceBelow < menuHeight + 20) {
        // Will be handled in JSX with dynamic positioning
      }
    }
  };

  const handlePlaylistMenuToggle = () => {
    if (!isPlaylistMenuOpen) {
      setIsPlaylistMenuOpen(true);
      setTimeout(() => {
        checkSubmenuPosition();
      }, 10);
    } else {
      setIsPlaylistMenuOpen(false);
    }
  };

  const checkSubmenuPosition = () => {
    if (menuRef.current) {
      const buttonRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const submenuWidth = 300;
      const submenuHeight = 350; // Estimated submenu height

      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      const spaceBelow = viewportHeight - buttonRect.bottom;

      if (spaceRight >= submenuWidth + 20) {
        setSubmenuPosition("right");
      } else if (spaceLeft >= submenuWidth + 20) {
        setSubmenuPosition("left");
      } else {
        setSubmenuPosition(spaceRight >= spaceLeft ? "right" : "left");
      }

      // Check if submenu should appear above when near bottom
      if (spaceBelow < submenuHeight + 20) {
        // Will be handled in JSX with dynamic positioning
      }
    }
  };

  const menuItems = [
    {
      icon: Eye,
      label: "View detail",
      action: () => {
        router.push(`/track/${track.id}`);
        setIsMenuOpen(false);
      },
    },
    {
      icon: Plus,
      label: 'Add to playlist',
      action: () => {
        executeWithAuth(() => {
          handlePlaylistMenuToggle();
        }, "playlist", track.name);
      },
      hasSubmenu: true,
    },
    {
      icon: Heart,
      label: track.checkTrackInFavorite ? 'Remove from Liked Songs' : 'Save to your Liked Songs',
      action: handleFavoriteClick,
    },
    // {
    //   icon: Album,
    //   label: 'Go to album',
    //   action: () => console.log('Go to album'),
    // },
    // {
    //   icon: Share,
    //   label: 'Share',
    //   action: () => console.log('Share'),
    //   hasSubmenu: true,
    // },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Three dots button */}
      <button
        onClick={handleMenuToggle}
        className={`rounded p-1 transition-opacity group-hover:opacity-100 hover:bg-gray-700 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>

      {/* Main context menu */}
      {isMenuOpen && (
        <div
          className={`absolute z-[60] w-[280px] rounded-lg border border-gray-700 bg-gray-800 py-2 shadow-xl ${
            mainMenuPosition === "right" ? "right-0" : "left-0 -translate-x-full"
          }`}
          style={{
            top: menuRef.current
              ? (() => {
                  const rect = menuRef.current.getBoundingClientRect();
                  const viewportHeight = window.innerHeight;
                  const menuHeight = 250;
                  const spaceBelow = viewportHeight - rect.bottom;

                  if (spaceBelow < menuHeight + 20) {
                    // Position above the button
                    return `-${menuHeight}px`;
                  }
                  // Position below the button (default)
                  return "32px";
                })()
              : "32px",
          }}
        >
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={item.action}
                className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-white transition-colors hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* Playlist submenu */}
              {item.label === 'Add to playlist' && isPlaylistMenuOpen && isAuthenticated && (
                <div 
                  ref={playlistMenuRef}
                  className={`absolute z-[70] max-h-[400px] w-[300px] overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 py-2 shadow-xl ${
                    submenuPosition === "right" ? "left-full ml-1" : "right-full mr-1"
                  }`}
                  style={{
                    top: menuRef.current
                      ? (() => {
                          const rect = menuRef.current.getBoundingClientRect();
                          const viewportHeight = window.innerHeight;
                          const submenuHeight = 350;
                          const spaceBelow = viewportHeight - rect.bottom;

                          if (spaceBelow < submenuHeight + 20) {
                            // Position to align with bottom of viewport if needed
                            return `-${Math.max(0, submenuHeight - spaceBelow)}px`;
                          }
                          return "0px";
                        })()
                      : "0px",
                  }}
                >
                  {/* Search bar */}
                  <div className="px-3 pb-2">
                    <div className="relative">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      <input
                        type="text"
                        placeholder="Find a playlist"
                        value={playlistSearch}
                        onChange={(e) => setPlaylistSearch(e.target.value)}
                        className="w-full rounded border-0 bg-gray-700 py-2 pr-4 pl-10 text-sm text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Playlist items */}
                  <div className="max-h-60 overflow-y-auto">
                    {isLoadingPlaylists ? (
                      <div className="px-4 py-2 text-sm text-gray-400">Loading playlists...</div>
                    ) : filteredPlaylists.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        {playlistSearch ? "No playlists found" : "No playlists available"}
                      </div>
                    ) : (
                      filteredPlaylists.map((playlist) => {
                        const inPlaylist = isTrackInPlaylist(playlist.id);
                        return (
                          <button
                            key={playlist.id}
                            onClick={() => {
                              if (inPlaylist) {
                                handleRemoveFromPlaylist(playlist.id);
                              } else {
                                handleAddToPlaylist(playlist.id);
                              }
                            }}
                            disabled={isPending}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-white transition-colors hover:bg-gray-700"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative h-4 w-4">
                                {playlist.coverImage ? (
                                  <Image
                                    src={playlist.coverImage}
                                    alt={playlist.name}
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 flex-shrink-0 rounded object-cover"
                                  />
                                ) : (
                                  <div className="h-4 w-4 flex-shrink-0 rounded bg-gray-600"></div>
                                )}
                              </div>
                              <span className="truncate">{playlist.name}</span>
                            </div>
                            {inPlaylist && <CheckIcon className="h-4 w-4 text-green-500" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />
    </div>
  );
};
