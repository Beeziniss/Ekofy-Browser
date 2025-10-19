'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  Plus, 
  Heart, 
  ListMusic, 
  Clock, 
  Radio, 
  User, 
  Album, 
  BarChart3, 
  Share,
  Flag,
  Search,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TrackActionMenuProps {
  track: any;
  isVisible?: boolean;
}

export const TrackActionMenu: React.FC<TrackActionMenuProps> = ({ 
  track, 
  isVisible = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [submenuPosition, setSubmenuPosition] = useState<'right' | 'left'>('right');
  const [mainMenuPosition, setMainMenuPosition] = useState<'right' | 'left'>('right');
  const menuRef = useRef<HTMLDivElement>(null);
  const playlistMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock playlists data
  const playlists = [
    { id: 1, name: 'Nhạc chầu âu', isCreated: false },
    { id: 2, name: 'Nhạc game', isCreated: false },
    { id: 3, name: 'Đọc truyện 12', isCreated: false },
  ];

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(playlistSearch.toLowerCase())
  );

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

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
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
      const menuWidth = 280;
      
      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      
      if (spaceRight >= menuWidth + 20) {
        setMainMenuPosition('right');
      } else if (spaceLeft >= menuWidth + 20) {
        setMainMenuPosition('left');
      } else {
        setMainMenuPosition(spaceRight >= spaceLeft ? 'right' : 'left');
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
      const submenuWidth = 300;
      
      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      
      if (spaceRight >= submenuWidth + 20) {
        setSubmenuPosition('right');
      } else if (spaceLeft >= submenuWidth + 20) {
        setSubmenuPosition('left');
      } else {
        setSubmenuPosition(spaceRight >= spaceLeft ? 'right' : 'left');
      }
    }
  };

  const menuItems = [
    {
      icon: Eye,
      label: 'View detail',
      action: () => {
        router.push(`/track/${track.id}`);
        setIsMenuOpen(false);
      },
    },
    {
      icon: Plus,
      label: 'Add to playlist',
      action: handlePlaylistMenuToggle,
      hasSubmenu: true,
    },
    {
      icon: Heart,
      label: 'Save to your Liked Songs',
      action: () => console.log('Save to liked songs'),
    },
    {
      icon: Album,
      label: 'Go to album',
      action: () => console.log('Go to album'),
    },
    {
      icon: Share,
      label: 'Share',
      action: () => console.log('Share'),
      hasSubmenu: true,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Three dots button */}
      <button
        onClick={handleMenuToggle}
        className={`p-1 hover:bg-gray-700 rounded transition-opacity group-hover:opacity-100 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </button>

      {/* Main context menu */}
      {isMenuOpen && (
        <div 
          className={`absolute top-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 w-[280px] z-[60] ${
            mainMenuPosition === 'right' 
              ? 'right-0' 
              : 'left-0 -translate-x-full'
          }`}
        >
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={item.action}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <svg 
                    className="w-4 h-4 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* Playlist submenu */}
              {item.label === 'Add to playlist' && isPlaylistMenuOpen && (
                <div 
                  ref={playlistMenuRef}
                  className={`absolute top-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 w-[300px] max-h-[400px] overflow-y-auto z-[70] ${
                    submenuPosition === 'right' 
                      ? 'left-full ml-1' 
                      : 'right-full mr-1'
                  }`}
                >
                  {/* Search bar */}
                  <div className="px-3 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Find a playlist"
                        value={playlistSearch}
                        onChange={(e) => setPlaylistSearch(e.target.value)}
                        className="w-full bg-gray-700 text-white text-sm pl-10 pr-4 py-2 rounded border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Create new playlist */}
                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>New playlist</span>
                  </button>

                  <div className="border-t border-gray-700 my-2"></div>

                  {/* Playlist items */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredPlaylists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => {
                          console.log(`Add to playlist: ${playlist.name}`);
                          setIsMenuOpen(false);
                          setIsPlaylistMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-4 h-4 bg-gray-600 rounded flex-shrink-0"></div>
                        <span className="truncate">{playlist.name}</span>
                      </button>
                    ))}
                  </div>

                  {filteredPlaylists.length === 0 && playlistSearch && (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No playlists found
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};