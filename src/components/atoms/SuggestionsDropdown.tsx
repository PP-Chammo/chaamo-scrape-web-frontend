import React from "react";
import { Loader2, Database, Search, ExternalLink } from "lucide-react";

interface SuggestionsDropdownProps {
  searchTerm: string;
  suggestions: { id: string; title: string; image_url?: string }[];
  onSuggestionClick: (title: string) => void;
  onManualEbaySearch?: () => void;
  isLoading?: boolean;
  showNoResults?: boolean;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  searchTerm,
  suggestions,
  onSuggestionClick,
  onManualEbaySearch,
  isLoading = false,
  showNoResults = false,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10 shadow-lg p-6">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <div className="flex flex-col items-center">
            <span className="font-medium">Searching database...</span>
            <span className="text-sm text-gray-500">Looking for matching cards</span>
          </div>
        </div>
      </div>
    );
  }

  if (showNoResults) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10 shadow-lg p-6">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Search className="w-8 h-8 text-gray-500" />
          <div className="text-center">
            <p className="font-medium">No suggestions found</p>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Try triggering scrape data from eBay
            </p>
            {onManualEbaySearch && (
              <button
                onClick={onManualEbaySearch}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                title="Trigger scrape data from eBay"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Trigger scrape data from eBay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute overflow-y-auto max-h-[600px] top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10 shadow-lg">
      <div className="p-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Database className="w-4 h-4" />
            <span>Database results ({suggestions.length})</span>
          </div>
          {onManualEbaySearch && (
            <button
              onClick={onManualEbaySearch}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors duration-200 cursor-pointer"
              title="Re-scrape and update latest data from eBay"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Trigger Re-Scrape "{searchTerm}"</span>
            </button>
          )}
        </div>
      </div>
      <ul>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSuggestionClick(suggestion.title)}
            className="w-full text-left p-3 hover:bg-teal-600/20 cursor-pointer transition-colors duration-200 rounded"
          >
            <div className="flex items-center gap-3">
              {suggestion.image_url && (
                <img
                  src={suggestion.image_url}
                  alt={suggestion.title}
                  className="w-20 h-20 object-contain rounded-lg shadow-md bg-gray-700"
                />
              )}
              <span className="flex-1 text-gray-200">{suggestion.title}</span>
            </div>
          </button>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsDropdown;
