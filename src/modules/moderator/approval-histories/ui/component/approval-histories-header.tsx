"use client";

interface ApprovalHistoriesHeaderProps {
  title: string;
}

export const ApprovalHistoriesHeader = ({ title }: ApprovalHistoriesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};