import React from "react";

interface SearchEmptySectionProps {
  type: string;
  query: string;
}

export const SearchEmptySection: React.FC<SearchEmptySectionProps> = ({ type, query }) => {
  const getEmptyMessage = () => {
    switch (type) {
      case "albums":
        return "No albums found";
      case "profiles":
        return "No profiles found";
      case "genres":
        return "No genres found";
      default:
        return `No ${type} found`;
    }
  };

  return (
    <div className="py-12 text-center">
      <h2 className="mb-4 text-xl font-semibold text-white">{getEmptyMessage()}</h2>
      <p className="text-gray-400">
        We couldn`t find any {type} matching `{query}`
      </p>
      <p className="mt-2 text-sm text-gray-500">Try searching with different keywords or check your spelling</p>
    </div>
  );
};
