import ChannelCard from "./channel-card";

interface ChannelGridProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
}

const ChannelGrid = ({ categories }: ChannelGridProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-gray-400">No channels available</p>
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {categories.map((category) => (
        <ChannelCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default ChannelGrid;
