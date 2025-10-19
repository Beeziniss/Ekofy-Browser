import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PlayPauseState {
  [key: string]: boolean; // key is the item ID, value is isPlaying
}

export const usePlayPause = () => {
  const [playingItems, setPlayingItems] = useState<PlayPauseState>({});

  const togglePlayPause = useCallback((itemId: string, itemType: 'track' | 'playlist' | 'artist', itemName?: string) => {
    setPlayingItems(prev => {
      const isCurrentlyPlaying = prev[itemId];
      const newState = { ...prev };
      
      if (isCurrentlyPlaying) {
        // Pause the item
        delete newState[itemId];
        // Use setTimeout to prevent duplicate toasts
        setTimeout(() => {
          toast.info(`Paused: ${itemName || 'Item'}`);
        }, 0);
      } else {
        // Play the item (and pause all others)
        Object.keys(newState).forEach(key => delete newState[key]);
        newState[itemId] = true;
        // Use setTimeout to prevent duplicate toasts
        setTimeout(() => {
          toast.success(`Playing: ${itemName || 'Item'}`);
        }, 0);
      }
      
      return newState;
    });
  }, []);

  const isPlaying = useCallback((itemId: string) => {
    return playingItems[itemId] || false;
  }, [playingItems]);

  return {
    togglePlayPause,
    isPlaying
  };
};