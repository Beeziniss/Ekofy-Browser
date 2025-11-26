import ChannelsSection from "../sections/channels-section";

const ChannelsView = () => {
  return (
    <div className="min-h-screen w-full bg-black p-6">
      <div className="space-y-10">
        {/* Page Header */}
        <h1 className="text-6xl font-bold tracking-tight text-white">All Channels</h1>

        {/* Categories Section */}
        <ChannelsSection />
      </div>
    </div>
  );
};

export default ChannelsView;
