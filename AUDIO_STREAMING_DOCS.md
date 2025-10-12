# Audio Streaming System Documentation

## Overview

This audio streaming system provides a complete solution for playing HLS (HTTP Live Streaming) audio content with a modern web interface. The system includes global state management, track queue functionality, and separate play/pause controls for individual tracks.

## Architecture

### Core Components

1. **Audio Store** (`src/store/stores/audio-store.ts`)
   - Global state management using Zustand
   - Handles current track, playback state, volume, queue management
   - Provides actions for all audio controls

2. **Audio Player** (`src/modules/client/common/ui/components/audio-player.tsx`)
   - Hidden HTML5 audio element with HLS.js integration
   - Handles streaming URL generation and token signing
   - Manages audio playback events and error handling

3. **Player Controls** (Playback control components)
   - `playback-control.tsx`: Main playback control bar
   - `player-control.tsx`: Play/pause, skip, shuffle, repeat controls
   - `player-options.tsx`: Volume control and queue display
   - `track-name-section.tsx`: Current track information display
   - `player-list-queue.tsx`: Queue management interface

4. **Track Card** (`src/modules/client/common/ui/components/track-card.tsx`)
   - Reusable component for displaying tracks with play/pause functionality
   - Independent play/pause state per track
   - Shows visual indicators for currently playing track

## Key Features

### Independent Track Playback (Exact Behavior as Requested)

- Each track card works independently with its own hover states
- When hovering over a track that is NOT currently playing → shows **play button**
- When hovering over the currently playing track → shows **pause button**
- Clicking play on a different track switches playback to that track (not pause)
- Each track maintains separate state - no global play/pause affecting all tracks
- Visual indicators show which track is currently playing with animated bars

### HLS Streaming Integration

- Automatic token signing for track access
- HLS.js integration for cross-browser compatibility
- Fallback to native HLS support (Safari)
- CDN loading of HLS.js library

### Queue Management

- Add tracks to queue automatically when played
- Skip forward/backward through queue
- Shuffle and repeat modes
- Visual queue display with track reordering

### Volume and Playback Controls

- Global volume control with mute functionality
- Seek/scrub through track timeline
- Visual progress indication
- Duration display in MM:SS format

## Usage Examples

### Using the Existing Track Card

The existing `TrackCard` component has been enhanced with audio streaming functionality:

```tsx
import TrackCard from "@/modules/client/common/ui/components/track/track-card";

// The track card now requires trackId and integrates with the audio store
<TrackCard
  trackId="unique-track-id"
  trackName="Song Title"
  coverImage="https://example.com/cover.jpg"
  artists={[{ id: "artist-1", stageName: "Artist Name" }]}
/>;
```

### Track Carousel Integration

The `TrackCarousel` component automatically passes the required props:

```tsx
import TrackCarousel from "@/modules/client/common/ui/components/track/track-carousel";

<TrackCarousel data={trackData} isLoading={false} />;
```

### Using Audio Store in Components

```tsx
import { useAudioStore } from "@/store";

const MyComponent = () => {
  const { currentTrack, isPlaying, setCurrentTrack, togglePlayPause } =
    useAudioStore();

  const handlePlay = () => {
    setCurrentTrack(track);
    togglePlayPause();
  };

  // ... component implementation
};
```

### Setting Up Streaming

The streaming flow works as follows:

1. Call `streamingApi.signToken(trackId)` to get authentication token
2. Generate streaming URL using `streamingApi.getStreamingUrl(trackId, token)`
3. Or use combined method: `streamingApi.getSignedStreamingUrl(trackId)`

```tsx
import { streamingApi } from "@/services/streaming-services";

const playTrack = async (trackId: string) => {
  try {
    const streamingUrl = await streamingApi.getSignedStreamingUrl(trackId);
    // URL format: ${NEXT_PUBLIC_URL_ENDPOINT}/api/media-streaming/cloudfront/${trackId}/master.m3u8?token=${token}
  } catch (error) {
    console.error("Failed to get streaming URL:", error);
  }
};
```

## Configuration

### Environment Variables

Make sure to set the following environment variable:

```env
NEXT_PUBLIC_URL_ENDPOINT=your-api-endpoint-url
```

### Dependencies

The system requires the following packages:

```json
{
  "hls.js": "^1.5.13", // For HLS streaming support
  "zustand": "^5.0.7", // For state management
  "@radix-ui/react-slider": "^1.3.5" // For volume/progress sliders
  // ... other existing dependencies
}
```

## Installation

1. Install HLS.js dependency:

```bash
npm install hls.js @types/hls.js
```

2. The HLS.js library is also loaded via CDN as a fallback in the `HlsLoader` component.

## File Structure

```
src/
├── store/
│   ├── types/
│   │   └── audio.ts              # Audio store type definitions
│   └── stores/
│       └── audio-store.ts        # Audio store implementation
├── services/
│   └── streaming-services.ts     # API services for streaming
└── modules/client/common/ui/components/
    ├── audio-player.tsx          # Hidden audio player with HLS.js
    ├── hls-loader.tsx           # HLS.js library loader
    ├── track-card.tsx           # Reusable track component
    ├── track-list.tsx           # Example track list
    └── playback-control/
        ├── playback-control.tsx      # Main control bar
        ├── player-control.tsx        # Playback controls
        ├── player-options.tsx        # Volume and queue
        ├── track-name-section.tsx    # Current track display
        └── player-list-queue.tsx     # Queue management
```

## Notes

- The audio player is hidden and integrated into the client layout
- All track interactions are managed through the global audio store
- The system supports both mouse and keyboard interactions
- Visual feedback is provided for all user actions
- Error handling is built into the streaming pipeline
- The queue system automatically manages track progression

This system provides a complete, production-ready audio streaming solution with modern web standards and best practices.
