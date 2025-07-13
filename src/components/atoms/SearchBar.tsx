import React from "react";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search by card title... (e.g. Lamine Yamal)"
      className="w-full p-4 pr-12 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300"
      onFocus={(e) => e.target.select()}
    />
    <SearchIcon className="absolute top-5 right-4 text-gray-400" />
  </form>
);

export default SearchBar;
