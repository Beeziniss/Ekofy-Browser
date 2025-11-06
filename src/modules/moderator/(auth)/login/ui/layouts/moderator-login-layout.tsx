import React from "react";

interface ModeratorLoginLayout {
  children: React.ReactNode;
}

const ModeratorLoginLayout = ({ children }: ModeratorLoginLayout) => {
  return <div className="flex min-h-screen w-full">{children}</div>;
};

export default ModeratorLoginLayout;
