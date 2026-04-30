'use client';

import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

interface SearchHeaderProps {
  initialSearch?: string;
  onSearch: (query: string) => void;
}

export const SearchHeader = ({ initialSearch = '', onSearch }: SearchHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Tours & Activities</h1>
      <p className="text-gray-600 mb-6">32 Tour & Activities Found</p>

      {/* Search Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Search by destination, tour name..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Quick Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            <strong>Country:</strong> Bangladesh
          </span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm">
          <span className="text-gray-700">
            <strong>Tours:</strong> 32 Found
          </span>
        </div>
      </div>
    </div>
  );
};
