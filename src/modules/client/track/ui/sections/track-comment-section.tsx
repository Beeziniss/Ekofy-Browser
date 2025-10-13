import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SendIcon } from "lucide-react";
import TrackCommentUser from "../components/track-comment-user";

const TrackCommentSection = () => {
  return (
    <div className="w-full space-y-8">
      {/* Track Comment Interaction */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-main-white text-lg font-bold">
            {0} Comments
          </span>

          {/* // TODO: refractor defaultValue and modify this sorting using api */}
          <Select defaultValue="sort-newest">
            <SelectTrigger className="!bg-main-card-bg w-fit border-none">
              <SelectValue placeholder="Select a sorting option" />
              {/* Sort by: Newest{" "}
                <ChevronDownIcon className="text-main-white size-6" /> */}
            </SelectTrigger>
            <SelectContent side="bottom" align="end">
              <SelectGroup>
                <SelectLabel>Options</SelectLabel>
                <SelectItem value="sort-newest">Sort by: Newest</SelectItem>
                <SelectItem value="sort-most-liked">
                  Sort by: Most Liked
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-x-3">
          <Avatar className="size-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="relative flex-1">
            <Input
              placeholder="Write a comment..."
              className="bg-main-card-bg h-10 rounded-full border-white/30 px-3 py-2.5 pr-32"
            />

            <Button className="bg-main-white absolute top-0 right-0 h-10 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none">
              <SendIcon className="size-4" />
              <span className="primary_gradient bg-clip-text text-sm text-transparent">
                Comment
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Track Comments List */}
      <div className="flex flex-col gap-y-6">
        {[...Array(4)].map((_, index) => (
          <TrackCommentUser key={index} />
        ))}
      </div>
    </div>
  );
};

export default TrackCommentSection;
