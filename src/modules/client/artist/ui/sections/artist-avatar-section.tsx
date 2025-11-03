import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistDetailQuery } from "@/gql/graphql";
import { getUserInitials } from "@/utils/format-shorten-name";

interface ArtistAvatarSectionProps {
  artistData: ArtistDetailQuery;
}

const ArtistAvatarSection = ({ artistData }: ArtistAvatarSectionProps) => {
  return (
    <div className="rounded-md px-6 py-2">
      <div className="primary_gradient max-h-72 min-h-72 rounded-md p-6 py-9" />

      <div className="-mt-32 flex items-end gap-6 px-6">
        <Avatar className="border-main-dark-bg size-64 border-6 shadow-lg">
          <AvatarImage
            src={artistData?.artists?.items?.[0]?.avatarImage || undefined}
            alt={artistData?.artists?.items?.[0]?.stageName}
          />
          <AvatarFallback>
            {getUserInitials(artistData?.artists?.items?.[0]?.stageName || "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-1 pb-4">
          <div className="text-main-white text-base font-normal tracking-wider">
            Artist
          </div>
          <div className="text-main-white text-4xl font-bold tracking-tight">
            {artistData?.artists?.items?.[0]?.stageName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistAvatarSection;
