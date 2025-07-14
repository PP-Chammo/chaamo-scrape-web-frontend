import React, { forwardRef } from "react";
import { SearchIcon, Loader2, ArrowRight } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onManualEbaySearch?: () => void;
  isLoading?: boolean;
  showEnterHint?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  searchTerm,
  setSearchTerm,
  onSubmit,
  onManualEbaySearch,
  isLoading = false,
  showEnterHint = false,
}, ref) => (
  <div className="relative">
    <form onSubmit={onSubmit} className="relative">
      <input
        ref={ref}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by card title... (e.g. Charizard)"
        className="w-full p-4 pr-12 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300"
        onFocus={(e) => e.target.select()}
        readOnly={isLoading}
      />
      {isLoading ? (
        <Loader2 className="absolute top-5 right-4 text-gray-400 animate-spin" />
      ) : showEnterHint ? (
        <button
          type="button"
          onClick={onManualEbaySearch}
          className="absolute top-6 right-4 text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
          title="Trigger scrape data from eBay"
        >
          <span className="text-xs">Scrape</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <SearchIcon className="absolute top-5 right-4 text-gray-400" />
      )}
    </form>
    {showEnterHint && (
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">
          Press Enter or click Scrape to fetch latest data from eBay
        </p>
      </div>
    )}
  </div>
));

SearchBar.displayName = "SearchBar";

export default SearchBar;
