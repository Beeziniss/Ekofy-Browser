import { MessageCircleIcon } from "lucide-react";

const Page = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <MessageCircleIcon className="text-main-purple mb-4 h-16 w-16" />
      <h2 className="text-main-white text-2xl font-semibold">Select a conversation</h2>
      <p className="text-main-white/70 mt-2">Choose a conversation from the list to view its details.</p>
    </div>
  );
};

export default Page;
