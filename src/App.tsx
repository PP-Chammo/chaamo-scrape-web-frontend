import React, { useState, useEffect } from "react";
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

export default function App() {
  const { apiGet } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    { id: string; title: string }[]
  >([]);
  const [selectedCardGroup, setSelectedCardGroup] = useState<CardGroup | null>(null);
  const [loadingText, setLoadingText] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 3) {
        setSuggestions([]);
        setLoadingText(undefined);
        return;
      }
      setError(null);
      setLoadingText("Loading...");
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("id, title, image_url")
          .ilike("title", `%${debouncedSearchTerm}%`)
          .limit(20);
        if (error) throw error;
        setSuggestions(data ?? []);
        if (debouncedSearchTerm.length > 3 && data.length === 0) {
          setLoadingText("No suggestions found");
        } else {
          setLoadingText(undefined);
        }
      } catch (err: unknown) {
        setError("Failed to load search suggestions");
        console.error("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm, submitted]);

  const fetchCardResources = async (title: string) => {
    setIsScraping(true);
    setLoadingText("Fetching card data from resources...");
    try {
      const response = await apiGet('/scrape_cards', {
        query: {
            query: title,
            region: 'uk',
            page: 1,
          }
        });
      if (response.result.length > 0) {
        setLoadingText('Loading...');
        setSearchTerm(title + ' ');
        setIsScraping(false);
      }
    } catch (err: unknown) {
      setError("Failed to fetch card data from resources");
      console.error("Error fetching card data from resources:", err);
    }
  };

  const fetchCardData = async (title: string) => {
    if (!title) {
      return;
    };
    if (!submitted) {
      setSubmitted(true);
      setSearchTerm(title);
      setSuggestions([]);
      setLoadingText("Loading...");
      setError(null);
      setSelectedCardGroup(null);
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("title", title)
          .single();
        if (error) {
          setLoadingText(undefined);
          throw error;
        }
        setSelectedCardGroup(data);
        setLoadingText(undefined);
      } catch (err: unknown) {
        setError("Failed to retrieve card data from database");
        console.error("Error fetching card data:", err);
      }
    }
  };

  const handleSuggestionClick = async (title: string) => {
    setSubmitted(true);
    await fetchCardData(title);
  };

  const handleSearch = (term: string) => {
    setSuggestions([]);
    setSearchTerm(term);
    setSubmitted(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      setSubmitted(true);
      await fetchCardData(suggestions[0].title);
    } else if (!isScraping) {
      fetchCardResources(searchTerm);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Header />
        <div className="relative max-w-2xl mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            onSubmit={handleSearchSubmit}
          />
          {!submitted && (
            <SuggestionsDropdown
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
        </div>
        <main className="mt-12">
          <div className="h-10">
            {!!loadingText && <p className="text-center text-lg">{loadingText}</p>}
            {error && <p className="text-center text-lg text-red-400">{error}</p>}
          </div>
          {selectedCardGroup && (
            <div className="mt-10">
              <CardGroupInfo cardGroup={selectedCardGroup} />
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Sales History:
              </h3>
              <SoldCardList soldCards={selectedCardGroup.sold_cards} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
