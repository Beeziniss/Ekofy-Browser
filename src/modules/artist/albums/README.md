# Artist Album Management

This module provides album creation and management functionality for artists.

## Components

### AlbumCreate
A trigger component that opens the album creation modal. Similar to `playlist-create` but for albums.

### AlbumManagementModal
A comprehensive modal for creating and editing albums with the following features:

#### Fields:
- **Name** (required): Album name (3-100 characters)
- **Description** (required): Album description (1-500 characters)
- **Cover Image**: Upload album cover (280x280px recommended)
- **Album Type** (required): Select from:
  - Album
  - Single
  - EP
  - Compilation
  - Live
  - Remix
  - Soundtrack
- **Contributing Artists** (required): Multi-select artists
  - Automatically assigns current user as main artist
  - Uses `trackUploadArtistListOptions` from `artist-options`
- **Tracks** (required): Multi-select tracks
  - Shows only tracks where the artist is main or featured artist
  - Filtered by `artistId` using `mainArtistIds` or `featuredArtistIds`
  - Uses infinite scroll for loading more tracks
- **Privacy Toggle**: Public/Private (isVisible field)
  - Public: Album is visible to everyone
  - Private: Only you can access

#### Features:
- Automatic current user assignment as main artist
- Track filtering by artist participation (main or featured)
- Infinite scroll for track selection
- Cover image upload with preview
- Form validation using Zod
- Release info automatically set to:
  - `isRelease: true`
  - `releaseStatus: OFFICIAL`
  - `releaseDate` and `releasedAt`: current date

## Usage

```tsx
import { AlbumCreate } from "@/modules/artist/albums/ui/components";

// In your component
<AlbumCreate />
```

## GraphQL Integration

### Mutation
- Uses `createAlbumMutationOptions` from `client-mutation-options`
- Mutation: `CreateAlbum` with `CreateAlbumRequestInput`

### Queries
- **Artists**: `trackUploadArtistListOptions` from `artist-options`
- **Tracks**: `artistTracksInfiniteOptions` from `client-options` (newly created)
  - Filters tracks by `mainArtistIds` or `featuredArtistIds` containing the artist's ID

## Dependencies
- React Hook Form with Zod validation
- TanStack Query for data fetching
- shadcn/ui components (Dialog, Form, Input, Select, MultiSelect, etc.)
- Playlist cover upload hook (reused from playlist module)

## Notes
- The `isVisible` field represents Public (true) / Private (false)
- All albums created have `releaseInfo.isRelease` set to `true`
- Current user's artist account is automatically included in the album
- Only tracks where the artist participates (main or featured) are shown

