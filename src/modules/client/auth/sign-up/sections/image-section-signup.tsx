import Link from "next/link";
import React from "react";

const SignUpImageSection = () => {
  return (
    <div className="relative hidden lg:flex lg:flex-1">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-purple-900/50 via-blue-800/50 to-pink-600/50"></div>

      {/* Concert background image */}
      <Link
        href="/" // Thay đổi đường link tại đây
        className="block h-full w-full"
        style={{ position: "relative", zIndex: 20 }}
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/image-login.png")',
          }}
        >
          {/* Overlay content */}
          <div className="relative z-20 flex h-full items-center justify-center">
            <div className="px-8 text-center text-white">
              <div className="mb-8">
                {/* Concert stage lighting effects */}
                <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-pulse rounded-full bg-blue-400/30 blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 h-24 w-24 animate-pulse rounded-full bg-pink-500/30 blur-2xl delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/3 h-20 w-20 animate-pulse rounded-full bg-green-400/30 blur-xl delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SignUpImageSection;
