interface DashboardHeaderProps {
  displayName: string;
  currentDate: string;
}

export const DashboardHeader = ({ displayName, currentDate }: DashboardHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 text-3xl font-bold text-white">Welcome, {displayName}</h1>
      <p className="text-gray-400">{currentDate}</p>
    </div>
  );
};
