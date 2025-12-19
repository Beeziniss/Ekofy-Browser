import Link from "next/link";
import SearchBar from "./search-bar";
import HeaderNav from "./header-nav";
import AuthButton from "./auth-button";
import { EkofyLogoText } from "@/assets/icons";

const ClientHeader = () => {
  return (
    <div className="bg-main-dark-bg fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-x-8">
        <Link href={"/"}>
          <EkofyLogoText className="w-32" />
        </Link>

        {/* Navigation Text */}
        <HeaderNav />

        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* Authentication Button */}
      <AuthButton />
    </div>
  );
};

export default ClientHeader;
