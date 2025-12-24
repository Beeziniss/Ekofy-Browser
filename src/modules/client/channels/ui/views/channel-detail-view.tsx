import ChannelDetailSection from "../sections/channel-detail-section";

interface ChannelDetailViewProps {
  channelId: string;
}

const ChannelDetailView = ({ channelId }: ChannelDetailViewProps) => {
  return (
    <div className="w-full px-6 pt-6 pb-10">
      <ChannelDetailSection channelId={channelId} />
    </div>
  );
};

export default ChannelDetailView;
