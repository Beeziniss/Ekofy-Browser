import Link from "next/link";
import React from "react";

const TrackUploadFooter = () => {
  return (
    <footer className="fixed bottom-0 flex w-full flex-col items-center gap-y-1 border-t border-white/30 py-[14px] font-medium">
      <p className="text-xs">
        By submitting your tracks to{" "}
        <strong className="primary_gradient bg-clip-text text-transparent">
          Ekofy
        </strong>
        , you acknowledge that you agree to{" "}
        <strong className="primary_gradient bg-clip-text text-transparent">
          Ekofy&apos;s
        </strong>{" "}
        <Link href={"#"} className="text-main-link hover:underline">
          Terms of Service
        </Link>
      </p>
      <p className="text-xs">
        Please make sure that you do not violate others&apos; copyright or
        privacy rights.
      </p>
    </footer>
  );
};

export default TrackUploadFooter;
