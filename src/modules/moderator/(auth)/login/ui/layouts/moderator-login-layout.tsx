import React from "react";

interface ModeratorLoginLayout {
  children: React.ReactNode;
}

const ModeratorLoginLayout = ({ children }: ModeratorLoginLayout) => {
  return (
    <div className="w-full flex min-h-screen">
      {children}
    </div>
  );
};

export default ModeratorLoginLayout;
