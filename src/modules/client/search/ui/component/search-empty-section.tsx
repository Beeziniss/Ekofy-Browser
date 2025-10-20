import React from 'react';

interface SearchEmptySectionProps {
  type: string;
  query: string;
}

export const SearchEmptySection: React.FC<SearchEmptySectionProps> = ({ type, query }) => {
  const getEmptyMessage = () => {
    switch (type) {
      case 'albums':
        return 'No albums found';
      case 'profiles':
        return 'No profiles found';
      case 'genres':
        return 'No genres found';
      default:
        return `No ${type} found`;
    }
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-white mb-4">
        {getEmptyMessage()}
      </h2>
      <p className="text-gray-400">
        We couldn`t find any {type} matching `{query}`
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Try searching with different keywords or check your spelling
      </p>
    </div>
  );
};