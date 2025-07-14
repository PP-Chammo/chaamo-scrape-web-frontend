import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/config/supabase";
import Header from "@/components/atoms/Header";
import SearchBar from "@/components/atoms/SearchBar";
import SuggestionsDropdown from "@/components/atoms/SuggestionsDropdown";
import CardGroupInfo from "@/components/atoms/CardGroupInfo";
import SoldCardList from "@/components/atoms/SoldCardList";
import { useDebounce } from "@/hooks/useDebounce";
import { useApi } from "@/hooks/useApi";

export interface SoldCard {
  link_url: string;
  sold_date: string;
  price: number;
  currency: string;
}

interface CardGroup {
  id: string;
  title: string;
  image_url: string;
  sold_cards: SoldCard[];
}

interface SearchState {
  isLoading: boolean;
  isScraping: boolean;
  suggestions: { id: string; title: string }[];
  selectedCardGroup: CardGroup | null;
  error: string | null;
  message: string | null;
  hint: string | null;
}

export default function App() {
  const { apiGet } = useApi();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    isScraping: false,
    suggestions: [],
    selectedCardGroup: null,
    error: null,
    message: null,
    hint: null,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Focus search input when no suggestions are found
  useEffect(() => {
    if (searchState.message === "No suggestions found" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchState.message]);

  // Fetch suggestions from Supabase
  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.length < 3) {
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        isLoading: false,
        message: null,
        hint: term.length > 0 ? "Type at least 3 characters to search..." : null,
      }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      message: "Searching database...",
      hint: null,
    }));

    try {
      const { data, error } = await supabase
        .from("cards")
        .select("id, title, image_url")
        .ilike("title", `%${term}%`)
        .limit(20);

      if (error) throw error;

      setSearchState(prev => ({
        ...prev,
        suggestions: data ?? [],
        isLoading: false,
        message: data && data.length === 0 ? "No suggestions found" : null,
        hint: data && data.length === 0 ? "Press Enter to fetch latest data from eBay" : null,
      }));
    } catch {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load search suggestions",
        message: null,
        hint: null,
      }));
    }
  }, []);

  // Fetch card data from Supabase
  const fetchCardData = useCallback(async (title: string) => {
    if (!title) return;

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      message: "Fetching card data from database...",
      hint: null,
      suggestions: [],
    }));

    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("title", title)
        .single();

      if (error) throw error;

      setSearchState(prev => ({
        ...prev,
        selectedCardGroup: data,
        isLoading: false,
        message: null,
        hint: null,
      }));
    } catch {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to retrieve card data from database",
        message: null,
        hint: null,
      }));
    }
  }, []);

  // Scrape cards from external resources
  const scrapeCards = useCallback(async (title: string) => {
    setSearchState(prev => ({
      ...prev,
      isScraping: true,
      error: null,
      message: "Fetching card data from eBay...",
      hint: "This may take a few moments...",
    }));

    try {
      const response = await apiGet('/scrape_cards', {
        query: {
          query: title,
          region: 'uk',
          page: 1,
        }
      });

      if (response.result && response.result.length > 0) {
        // After successful scraping, fetch suggestions again
        await fetchSuggestions(title);
        setSearchState(prev => ({
          ...prev,
          isScraping: false,
          message: null,
          hint: "Data updated! Select from suggestions above.",
        }));
      } else {
        setSearchState(prev => ({
          ...prev,
          isScraping: false,
          error: "No cards found from eBay",
          message: null,
          hint: null,
        }));
      }
    } catch {
      setSearchState(prev => ({
        ...prev,
        isScraping: false,
        error: "Failed to fetch card data from eBay",
        message: null,
        hint: null,
      }));
    }
  }, [apiGet, fetchSuggestions]);

  // Handle search term changes
  useEffect(() => {
    fetchSuggestions(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(async (title: string) => {
    setSearchTerm(title);
    await fetchCardData(title);
  }, [fetchCardData]);

  // Handle search input change
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setSearchState(prev => ({
      ...prev,
      selectedCardGroup: null,
      error: null,
      message: null,
      hint: term.length > 0 ? "Type at least 3 characters to search..." : null,
    }));
  }, []);

  // Handle manual eBay search trigger
  const handleManualEbaySearch = useCallback(async () => {
    if (searchTerm.trim() && !searchState.isScraping) {
      await scrapeCards(searchTerm);
    }
  }, [searchTerm, searchState.isScraping, scrapeCards]);

  // Handle form submission (Enter key or form submit)
  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;

    // If there are suggestions, select the first one
    if (searchState.suggestions.length > 0) {
      await fetchCardData(searchState.suggestions[0].title);
    } else if (!searchState.isScraping) {
      // If no suggestions, try scraping
      await scrapeCards(searchTerm);
    }
  }, [searchTerm, searchState.suggestions, searchState.isScraping, fetchCardData, scrapeCards]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        <div className="relative max-w-2xl mx-auto">
          <SearchBar
            ref={searchInputRef}
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            onSubmit={handleSearchSubmit}
            onManualEbaySearch={handleManualEbaySearch}
            isLoading={searchState.isLoading || searchState.isScraping}
            showEnterHint={searchState.message === "No suggestions found"}
          />
          {!searchState.selectedCardGroup && (
            <SuggestionsDropdown
              searchTerm={searchTerm}
              suggestions={searchState.suggestions}
              onSuggestionClick={handleSuggestionClick}
              onManualEbaySearch={handleManualEbaySearch}
              isLoading={searchState.isLoading}
              showNoResults={searchState.message === "No suggestions found"}
            />
          )}
        </div>
        <main className="mt-12">
          <div className="h-16 flex flex-col items-center justify-center gap-2">
            {searchState.message && (
              <p className="text-center text-lg font-medium">{searchState.message}</p>
            )}
            {searchState.hint && (
              <p className="text-center text-sm text-gray-400">{searchState.hint}</p>
            )}
            {searchState.error && (
              <p className="text-center text-lg text-red-400">{searchState.error}</p>
            )}
          </div>
          {searchState.selectedCardGroup && (
            <div className="mt-10">
              <CardGroupInfo cardGroup={searchState.selectedCardGroup} />
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Sales History:
              </h3>
              <SoldCardList soldCards={searchState.selectedCardGroup.sold_cards} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
