import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import PlaylistManagementModal from "./playlist-management-modal";

const PlaylistCreate = () => {
  const [open, setOpen] = useState(false);

  return (
    <PlaylistManagementModal
      mode="create"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <div className="flex w-full flex-col gap-y-2.5">
          <DialogTrigger asChild>
            <div className="bg-main-card-bg hover:bg-main-purple/20 flex aspect-square w-full cursor-pointer items-center justify-center rounded-md transition">
              <PlusIcon className="text-main-white size-9" />
            </div>
          </DialogTrigger>
          <p
            className="text-main-white hover:text-main-purple cursor-pointer text-sm hover:underline"
            onClick={() => setOpen(true)}
          >
            Create a playlist
          </p>
        </div>
      }
    />
  );
};

export default PlaylistCreate;
