'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, Heart, Share, Flag } from 'lucide-react';

interface GenericActionMenuProps {
  item: any;
  type: 'artist' | 'playlist' | 'album';
  className?: string;
}

export const GenericActionMenu: React.FC<GenericActionMenuProps> = ({ 
  item, 
  type,
  className = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'right' | 'left'>('right');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (isMenuOpen) {
        checkMenuPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen) {
      // Calculate position before opening
      setTimeout(() => {
        checkMenuPosition();
      }, 0);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const checkMenuPosition = () => {
    if (menuRef.current) {
      const buttonRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const menuWidth = 200;
      
      if (buttonRect.right + menuWidth > viewportWidth - 20) {
        setMenuPosition('left');
      } else {
        setMenuPosition('right');
      }
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        icon: Share,
        label: 'Share',
        action: () => console.log(`Share ${type}`, item),
      },
      {
        icon: Flag,
        label: 'Report',
        action: () => console.log(`Report ${type}`, item),
      },
    ];

    switch (type) {
      case 'artist':
        return [
          {
            icon: Plus,
            label: 'Follow',
            action: () => console.log('Follow artist', item),
          },
          ...commonItems,
        ];
      
      case 'playlist':
        return [
          {
            icon: Heart,
            label: 'Like',
            action: () => console.log('Like playlist', item),
          },
          {
            icon: Plus,
            label: 'Add to Your Library',
            action: () => console.log('Add playlist to library', item),
          },
          ...commonItems,
        ];
      
      case 'album':
        return [
          {
            icon: Heart,
            label: 'Save to Your Library',
            action: () => console.log('Save album', item),
          },
          ...commonItems,
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Three dots button */}
      <button
        onClick={handleMenuToggle}
        className={`p-2 hover:bg-gray-700 rounded-full transition-all duration-200 group-hover:opacity-100 ${
          isMenuOpen ? 'opacity-100 bg-gray-700' : 'opacity-0'
        }`}
      >
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </button>

      {/* Context menu */}
      {isMenuOpen && (
        <div className={`absolute top-10 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 min-w-[200px] z-[60] ${
          menuPosition === 'right' ? 'right-0' : 'left-0'
        }`}>
          {menuItems.map((menuItem, index) => (
            <button
              key={index}
              onClick={() => {
                menuItem.action();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <menuItem.icon className="w-4 h-4" />
              <span>{menuItem.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};