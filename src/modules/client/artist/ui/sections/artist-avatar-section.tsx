import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistDetailQuery } from "@/gql/graphql";
import { getUserInitials } from "@/utils/format-shorten-name";

interface ArtistAvatarSectionProps {
  artistData: ArtistDetailQuery;
}

const ArtistAvatarSection = ({ artistData }: ArtistAvatarSectionProps) => {
  return (
    <div className="primary_gradient flex items-center gap-x-4 p-6 py-9">
      <Avatar className="size-64">
        <AvatarImage
          src={artistData?.artists?.items?.[0]?.avatarImage || undefined}
          alt={artistData?.artists?.items?.[0]?.stageName}
        />
        <AvatarFallback>
          {getUserInitials(artistData?.artists?.items?.[0]?.stageName || "")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-y-1">
        <div className="text-main-white text-base font-normal">Artist</div>
        <div className="text-main-white text-4xl font-bold">
          {artistData?.artists?.items?.[0]?.stageName}
        </div>
      </div>
    </div>
  );
};

export default ArtistAvatarSection;
