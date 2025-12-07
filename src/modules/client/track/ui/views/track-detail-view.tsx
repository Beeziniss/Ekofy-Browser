import TrackSection from "../sections/track-section";
import TrackLikeSection from "../sections/track-like-section";
import TrackOwnerSection from "../sections/track-owner-section";
import TrackRelatedSection from "../sections/track-related-section";
import TrackCommentSection from "../sections/track-comment-section";

interface TrackDetailViewProps {
  trackId: string;
}

const TrackDetailView = ({ trackId }: TrackDetailViewProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-8">
        <TrackSection trackId={trackId} />

        <div className="grid w-full grid-cols-12 gap-8 px-8">
          <div className="col-span-9 space-y-8">
            <TrackOwnerSection trackId={trackId} />
            <TrackCommentSection trackId={trackId} />
          </div>
          <div className="col-span-3 space-y-8">
            <TrackRelatedSection />
            <TrackLikeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetailView;
