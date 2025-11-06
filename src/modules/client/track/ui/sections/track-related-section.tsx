import Image from "next/image";
import Link from "next/link";

const TrackRelatedSection = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-main-white text-sm font-bold uppercase">Related Tracks</span>
        <Link href={"#"} className="text-primary-500 text-main-grey-dark-1 text-sm font-bold hover:underline">
          View all
        </Link>
      </div>

      <div className="flex flex-col gap-y-4">
        {[...Array(3)].map((_, index) => (
          <div className="flex items-center gap-x-2" key={index}>
            <Image
              src={"https://placehold.co/48x48"}
              alt={"Track Name"}
              width={48}
              height={48}
              className="rounded-sm object-cover"
              unoptimized
            />
            <div className="flex flex-col">
              <span className="text-main-white line-clamp-1 text-sm font-semibold">{"Track Name"}</span>
              <span className="line-clamp-1 text-xs text-gray-400">{"Track Artist"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackRelatedSection;
