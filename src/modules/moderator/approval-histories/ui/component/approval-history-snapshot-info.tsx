"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Eye, Music, FileText, Disc, DollarSign, Package } from "lucide-react";
import { format } from "date-fns";
import { 
  ApprovalHistorySnapshot, 
  ArtistRegistrationSnapshot, 
  TrackUploadSnapshot,
  WorkUploadSnapshot,
  RecordingUploadSnapshot,
  DisputeResolutionSnapshot
} from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/utils/image-utils";
import { fetchArtistNames, fetchCategoryNames, fetchUserFullInfo } from "@/utils/approval-history-utils";

interface ApprovalHistorySnapshotInfoProps {
  snapshot: ApprovalHistorySnapshot;
  approvalType: "ARTIST_REGISTRATION" | "TRACK_UPLOAD" | "WORK_UPLOAD" | "RECORDING_UPLOAD" | "DISPUTE_RESOLUTION";
}

// Component for Artist Registration
const ArtistRegistrationView = ({ snapshot }: { snapshot: ArtistRegistrationSnapshot }) => {
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (snapshot.IdentityCard.FrontImage) {
      getImageUrl(snapshot.IdentityCard.FrontImage).then(setFrontImageUrl);
    }
    if (snapshot.IdentityCard.BackImage) {
      getImageUrl(snapshot.IdentityCard.BackImage).then(setBackImageUrl);
    }
    if (snapshot.AvatarImage) {
      getImageUrl(snapshot.AvatarImage).then(setAvatarUrl);
    }
  }, [snapshot]);

  return (
    <>
      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Artist Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          {avatarUrl && (
            <div className="flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-700">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium">Full Name:</label>
              <p className="text-muted-foreground text-sm">{snapshot.FullName}</p>
            </div>
            <div>
              <label className="font-medium">Email:</label>
              <p className="text-muted-foreground text-sm">{snapshot.Email}</p>
            </div>
            <div>
              <label className="font-medium">Stage Name:</label>
              <p className="text-muted-foreground text-sm">{snapshot.StageName}</p>
            </div>
            <div>
              <label className="font-medium">Artist Type:</label>
              <p className="text-muted-foreground text-sm">{snapshot.ArtistType}</p>
            </div>
            <div>
              <label className="font-medium">Phone Number:</label>
              <p className="text-muted-foreground text-sm">{snapshot.PhoneNumber}</p>
            </div>
            <div>
              <label className="font-medium">Gender:</label>
              <p className="text-muted-foreground text-sm">{snapshot.Gender}</p>
            </div>
            <div>
              <label className="font-medium">Birth Date:</label>
              <p className="text-muted-foreground text-sm">{format(new Date(snapshot.BirthDate), "MMM dd, yyyy")}</p>
            </div>
            <div>
              <label className="font-medium">Requested At:</label>
              <p className="text-muted-foreground text-sm">
                {format(new Date(snapshot.RequestedAt), "MMM dd, yyyy HH:mm:ss")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Members */}
          <div>
            <h4 className="mb-3 font-medium">Members</h4>
            <div className="grid gap-3">
              {snapshot.Members.map((member, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <span className="text-sm font-medium">Name:</span>
                      <p className="text-muted-foreground text-sm">{member.FullName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Email:</span>
                      <p className="text-muted-foreground text-sm">{member.Email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Phone:</span>
                      <p className="text-muted-foreground text-sm">{member.PhoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Role:</span>
                      <Badge variant={member.IsLeader ? "default" : "secondary"} className="ml-2">
                        {member.IsLeader ? "Leader" : "Member"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Legal Documents */}
          {snapshot.LegalDocuments && snapshot.LegalDocuments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">Legal Documents</h4>
                <div className="grid gap-3">
                  {snapshot.LegalDocuments.map((doc, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium">Name:</span>
                          <p className="text-muted-foreground text-sm">{doc.Name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Type:</span>
                          <Badge variant="outline">{doc.DocumentType}</Badge>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium">Note:</span>
                          <p className="text-muted-foreground text-sm">{doc.Note}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.DocumentUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Identity Card */}
          <div>
            <h4 className="mb-3 font-medium">Identity Card Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">ID Number:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Number}</p>
              </div>
              <div>
                <label className="font-medium">Full Name:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.FullName}</p>
              </div>
              <div>
                <label className="font-medium">Date of Birth:</label>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(snapshot.IdentityCard.DateOfBirth), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <label className="font-medium">Gender:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Gender}</p>
              </div>
              <div>
                <label className="font-medium">Nationality:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.Nationality}</p>
              </div>
              <div>
                <label className="font-medium">Place of Origin:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.PlaceOfOrigin}</p>
              </div>
              <div className="md:col-span-2">
                <label className="font-medium">Address:</label>
                <p className="text-muted-foreground text-sm">{snapshot.IdentityCard.PlaceOfResidence.AddressLine}</p>
              </div>
              <div>
                <label className="font-medium">Valid Until:</label>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(snapshot.IdentityCard.ValidUntil), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            {/* Identity Card Images */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="font-medium">Front Image:</label>
                <div className="mt-2 rounded-lg border p-2">
                  {frontImageUrl ? (
                    <>
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(frontImageUrl)}
                      >
                        <Image
                          src={frontImageUrl}
                          alt="ID Front"
                          width={400}
                          height={300}
                          className="h-80 w-full rounded object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href={frontImageUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Size
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-gray-800 rounded">
                      <span className="text-muted-foreground">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="font-medium">Back Image:</label>
                <div className="mt-2 rounded-lg border p-2">
                  {backImageUrl ? (
                    <>
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(backImageUrl)}
                      >
                        <Image
                          src={backImageUrl}
                          alt="ID Back"
                          width={400}
                          height={300}
                          className="h-80 w-full rounded object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href={backImageUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Size
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-80 items-center justify-center bg-gray-800 rounded">
                      <span className="text-muted-foreground">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

// Component for Track Upload
const TrackUploadView = ({ snapshot }: { snapshot: TrackUploadSnapshot }) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mainArtists, setMainArtists] = useState<Map<string, string>>(new Map());
  const [featuredArtists, setFeaturedArtists] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Load cover image
      if (snapshot.CoverImage) {
        const url = await getImageUrl(snapshot.CoverImage);
        setCoverImageUrl(url);
      }

      // Load main artists
      if (snapshot.MainArtistIds && snapshot.MainArtistIds.length > 0) {
        const artistMap = await fetchArtistNames(snapshot.MainArtistIds);
        setMainArtists(artistMap);
      }

      // Load featured artists
      if (snapshot.FeaturedArtistIds && snapshot.FeaturedArtistIds.length > 0) {
        const artistMap = await fetchArtistNames(snapshot.FeaturedArtistIds);
        setFeaturedArtists(artistMap);
      }

      // Load categories
      if (snapshot.CategoryIds && snapshot.CategoryIds.length > 0) {
        const categoryMap = await fetchCategoryNames(snapshot.CategoryIds);
        setCategories(categoryMap);
      }

      setIsLoadingData(false);
    };

    loadData();
  }, [snapshot]);

  return (
    <>
      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Track Upload Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Image */}
          {coverImageUrl && (
            <div className="flex justify-center">
              <div 
                className="relative h-64 w-64 overflow-hidden rounded-lg border-4 border-gray-700 cursor-pointer"
                onClick={() => setSelectedImage(coverImageUrl)}
              >
                <Image
                  src={coverImageUrl}
                  alt="Cover"
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="font-medium">Track Name:</label>
              <p className="text-muted-foreground text-sm">{snapshot.Name}</p>
            </div>
            <div>
              <label className="font-medium">Type:</label>
              <Badge variant="outline">{snapshot.Type}</Badge>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Description:</label>
              <p className="text-muted-foreground text-sm">{snapshot.Description || "N/A"}</p>
            </div>
            <div>
              <label className="font-medium">Is Explicit:</label>
              <Badge variant={snapshot.IsExplicit ? "destructive" : "secondary"}>
                {snapshot.IsExplicit ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <label className="font-medium">Release Status:</label>
              <Badge variant="outline">{snapshot.ReleaseInfo.ReleaseStatus}</Badge>
            </div>
            <div>
              <label className="font-medium">Requested At:</label>
              <p className="text-muted-foreground text-sm">
                {format(new Date(snapshot.RequestedAt), "MMM dd, yyyy HH:mm:ss")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Artists */}
          <div>
            <h4 className="mb-3 font-medium">Artists</h4>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Main Artists */}
              <div>
                <label className="text-sm font-medium">Main Artists:</label>
                {isLoadingData ? (
                  <p className="text-muted-foreground text-sm mt-1">Loading...</p>
                ) : snapshot.MainArtistIds && snapshot.MainArtistIds.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {snapshot.MainArtistIds.map((artistId, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="default">
                          {mainArtists.get(artistId) || artistId}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mt-1">No main artists</p>
                )}
              </div>

              {/* Featured Artists */}
              <div>
                <label className="text-sm font-medium">Featured Artists:</label>
                {isLoadingData ? (
                  <p className="text-muted-foreground text-sm mt-1">Loading...</p>
                ) : snapshot.FeaturedArtistIds && snapshot.FeaturedArtistIds.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {snapshot.FeaturedArtistIds.map((artistId, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {featuredArtists.get(artistId) || artistId}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mt-1">No featured artists</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <label className="font-medium">Categories:</label>
            {isLoadingData ? (
              <p className="text-muted-foreground text-sm mt-2">Loading...</p>
            ) : snapshot.CategoryIds && snapshot.CategoryIds.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {snapshot.CategoryIds.map((categoryId, index) => (
                  <Badge key={index} variant="outline">
                    {categories.get(categoryId) || categoryId}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm mt-2">No categories</p>
            )}
          </div>

          {/* Lyrics */}
          {snapshot.Lyrics && (
            <>
              <Separator />
              <div>
                <label className="font-medium">Lyrics:</label>
                <div className="mt-2 rounded-lg bg-gray-900 p-4">
                  <pre className="text-muted-foreground text-sm whitespace-pre-wrap">{snapshot.Lyrics}</pre>
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {snapshot.Tags && snapshot.Tags.length > 0 && (
            <>
              <Separator />
              <div>
                <label className="font-medium">Tags:</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {snapshot.Tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Legal Documents */}
          {snapshot.LegalDocuments && snapshot.LegalDocuments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3 font-medium">Legal Documents</h4>
                <div className="grid gap-3">
                  {snapshot.LegalDocuments.map((doc, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium">Name:</span>
                          <p className="text-muted-foreground text-sm">{doc.Name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Type:</span>
                          <Badge variant="outline">{doc.DocumentType}</Badge>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium">Note:</span>
                          <p className="text-muted-foreground text-sm">{doc.Note}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.DocumentUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

// Component for Work Upload
const WorkUploadView = ({ snapshot }: { snapshot: WorkUploadSnapshot }) => {
  const [artists, setArtists] = useState<Map<string, string>>(new Map());
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Get all unique user IDs from work splits
      const userIds = snapshot.WorkSplits.map(split => split.UserId);
      if (userIds.length > 0) {
        const artistMap = await fetchArtistNames(userIds);
        setArtists(artistMap);
      }

      setIsLoadingData(false);
    };

    loadData();
  }, [snapshot]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Work Upload Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="font-medium">Description:</label>
          <p className="text-muted-foreground text-sm">{snapshot.Description || "N/A"}</p>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-medium">Work Splits</h4>
          {isLoadingData ? (
            <p className="text-muted-foreground text-sm">Loading artist information...</p>
          ) : (
            <div className="grid gap-3">
              {snapshot.WorkSplits.map((split, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <span className="text-sm font-medium">Artist:</span>
                      <p className="text-muted-foreground text-sm">
                        {artists.get(split.UserId) || split.UserId}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Role:</span>
                      <Badge variant="outline">{split.ArtistRole}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Percentage:</span>
                      <p className="text-muted-foreground text-sm">{split.Percentage}%</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Recording Upload
const RecordingUploadView = ({ snapshot }: { snapshot: RecordingUploadSnapshot }) => {
  const [artists, setArtists] = useState<Map<string, string>>(new Map());
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Get all unique user IDs from recording splits
      const userIds = snapshot.RecordingSplitRequests.map(split => split.UserId);
      if (userIds.length > 0) {
        const artistMap = await fetchArtistNames(userIds);
        setArtists(artistMap);
      }

      setIsLoadingData(false);
    };

    loadData();
  }, [snapshot]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Disc className="mr-2 h-5 w-5" />
          Recording Upload Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="font-medium">Description:</label>
          <p className="text-muted-foreground text-sm">{snapshot.Description || "N/A"}</p>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-medium">Recording Splits</h4>
          {isLoadingData ? (
            <p className="text-muted-foreground text-sm">Loading artist information...</p>
          ) : (
            <div className="grid gap-3">
              {snapshot.RecordingSplitRequests.map((split, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <span className="text-sm font-medium">Artist:</span>
                      <p className="text-muted-foreground text-sm">
                        {artists.get(split.UserId) || split.UserId}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Role:</span>
                      <Badge variant="outline">{split.ArtistRole}</Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Percentage:</span>
                      <p className="text-muted-foreground text-sm">{split.Percentage}%</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Dispute Resolution
const DisputeResolutionView = ({ snapshot }: { snapshot: DisputeResolutionSnapshot }) => {
  const [client, setClient] = useState<{ fullName: string; email: string } | null>(null);
  const [provider, setProvider] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      // Fetch client info (user)
      const clientMap = await fetchUserFullInfo([snapshot.ClientId]);
      const clientInfo = clientMap.get(snapshot.ClientId);
      if (clientInfo) {
        setClient(clientInfo);
      }
      
      // Fetch provider info (artist)
      const artistMap = await fetchArtistNames([snapshot.ProviderId]);
      setProvider(artistMap.get(snapshot.ProviderId) || "Unknown Artist");
      
      setIsLoadingData(false);
    };

    loadData();
  }, [snapshot]);

  const formatCurrency = (amount: number, currency: string = "VND") => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Refund Resolution Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Refund Resolution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Amount */}
          <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Total Order Amount</span>
              <span className="text-xl font-bold text-blue-400">
                {formatCurrency(snapshot.PackageOrderAmount)}
              </span>
            </div>
          </div>

          {/* Visual Split */}
          <div className="space-y-2">
            <div className="h-12 flex rounded-lg overflow-hidden">
              <div 
                className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${snapshot.RequestorPercentage}%` }}
              >
                Client {snapshot.RequestorPercentage}%
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${snapshot.ArtistPercentage}%` }}
              >
                Artist {snapshot.ArtistPercentage}%
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Client Refund</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(snapshot.RefundAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  {snapshot.RequestorPercentage}% of total
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Artist Escrow Release</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(snapshot.EscrowReleaseAmount)}
                </p>
                <p className="text-xs text-gray-500">
                  {snapshot.ArtistPercentage}% of total
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Package Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-gray-400">Package Order ID:</span>
              <p className="text-gray-200 mt-1 font-mono text-sm">{snapshot.PackageOrderId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Status:</span>
              <div className="mt-1">
                <Badge variant="outline">{snapshot.PackageOrderStatus}</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Amount:</span>
              <p className="text-gray-200 mt-1">
                {formatCurrency(snapshot.PackageOrderAmount)}
              </p>
            </div>
            {snapshot.DisputedReason && (
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-400">Disputed Reason:</span>
                <p className="text-muted-foreground mt-1 text-sm rounded-lg bg-gray-900/50 p-3">
                  {snapshot.DisputedReason}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client and Artist Information */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingData ? (
              <p className="text-muted-foreground text-sm">Loading client information...</p>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-400">Name:</span>
                  <p className="text-gray-200 mt-1">{client?.fullName || "Unknown"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Email:</span>
                  <p className="text-gray-200 mt-1">{client?.email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Client ID:</span>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{snapshot.ClientId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Artist Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="mr-2 h-5 w-5" />
              Artist Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingData ? (
              <p className="text-muted-foreground text-sm">Loading artist information...</p>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-400">Stage Name:</span>
                  <p className="text-gray-200 mt-1">{provider}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Artist ID:</span>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{snapshot.ProviderId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ApprovalHistorySnapshotInfo = ({ snapshot, approvalType }: ApprovalHistorySnapshotInfoProps) => {
  switch (approvalType) {
    case "ARTIST_REGISTRATION":
      return <ArtistRegistrationView snapshot={snapshot as ArtistRegistrationSnapshot} />;
    case "TRACK_UPLOAD":
      return <TrackUploadView snapshot={snapshot as TrackUploadSnapshot} />;
    case "WORK_UPLOAD":
      return <WorkUploadView snapshot={snapshot as WorkUploadSnapshot} />;
    case "RECORDING_UPLOAD":
      return <RecordingUploadView snapshot={snapshot as RecordingUploadSnapshot} />;
    case "DISPUTE_RESOLUTION":
      return <DisputeResolutionView snapshot={snapshot as DisputeResolutionSnapshot} />;
    default:
      return (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Unknown approval type</p>
          </CardContent>
        </Card>
      );
  }
};
