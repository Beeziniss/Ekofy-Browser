"use client";

import AuthButton from "./auth-button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./search-bar";

const ClientHeader = () => {
  const pathname = usePathname();

  return (
    <div className="font-bepro bg-main-dark-bg fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-2">
      {/* Logo */}
      <div className="flex items-center gap-x-8">
        <Link href={"/"}>
          <div className="flex items-center gap-x-2">
            <Image
              src={"/ekofy-logo.svg"}
              alt="Ekofy Logo"
              width={37}
              height={37}
            />
            <span className="primary_gradient inline-block bg-clip-text text-2xl font-bold text-transparent uppercase">
              Ekofy
            </span>
          </div>
        </Link>

        {/* Navigation Text */}
        <div className="flex items-center gap-x-6">
          <Link
            href={"/"}
            className={`inline-block py-3 text-[#999999] hover:text-[#f2f2f2] ${pathname === "/" ? "border-b-2 border-b-[#f2f2f2] text-[#f2f2f2]" : ""}`}
          >
            <span className="text-sm font-semibold">Home</span>
          </Link>
          <Link
            href={"/library"}
            className={`inline-block py-3 text-[#999999] hover:text-[#f2f2f2] ${pathname === "/library" ? "border-b-2 border-b-[#f2f2f2] text-[#f2f2f2]" : ""}`}
          >
            <span className="text-sm font-semibold">Library</span>
          </Link>
          <Link
            href={"/hub"}
            className={`inline-block py-3 text-[#999999] hover:text-[#f2f2f2] ${pathname === "/hub" ? "border-b-2 border-b-[#f2f2f2] text-[#f2f2f2]" : ""}`}
          >
            <span className="text-sm font-semibold">Hub</span>
          </Link>
        </div>

        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* Authentication Button */}
      <AuthButton />
    </div>
  );
};

export default ClientHeader;
