export interface TrackUploadArtist {
  __typename?: "Artist" | undefined;
  id: string;
  userId: string;
  stageName: string;
  user: Array<{
    __typename?: "User" | undefined;
    stripeAccountId?: string | null | undefined;
  }>;
}
