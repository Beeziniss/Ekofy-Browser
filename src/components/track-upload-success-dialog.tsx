"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EkofyLogo } from "@/assets/icons";

interface TrackUploadSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrackUploadSuccessDialog = ({ open, onOpenChange }: TrackUploadSuccessDialogProps) => {
  const router = useRouter();

  const handleGoToTracks = () => {
    onOpenChange(false);
    router.push("/artist/studio/tracks");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" showCloseButton={false}>
        <DialogHeader className="text-center">
          <div className="mb-6 flex justify-center">
            <EkofyLogo className="size-24" />
          </div>
          <DialogTitle className="mb-4 text-4xl font-bold">Saved to Ekofy.</DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            Congratulations! Your tracks are now available on Ekofy.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center gap-3">
          <Button onClick={handleClose} variant="outline" className="w-fit">
            Close
          </Button>
          <Button onClick={handleGoToTracks} className="w-fit" variant="ekofy">
            Go to My Tracks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackUploadSuccessDialog;
