import React from "react";

interface SuggestionsDropdownProps {
  suggestions: { id: string; title: string; image_url?: string }[];
  onSuggestionClick: (title: string) => void;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  suggestions,
  onSuggestionClick,
}) =>
  suggestions.length > 0 ? (
    <div className="absolute overflow-y-auto max-h-[600px] top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10 shadow-lg">
      <ul>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSuggestionClick(suggestion.title)}
            className="w-full text-left p-3 hover:bg-teal-600/20 cursor-pointer transition-colors duration-200 rounded"
          >
            <div className="flex items-center gap-3">
              <img
                src={suggestion.image_url}
                alt={suggestion.title}
                className="w-20 object-contain rounded-lg shadow-md"
              />
              {suggestion.title}
            </div>
          </button>
        ))}
      </ul>
    </div>
  ) : null;

export default SuggestionsDropdown;
