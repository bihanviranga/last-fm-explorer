import { create } from 'zustand';
import type { Artist } from '../api/types';

interface SearchState {
  query: string;
  results: Artist[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setResults: (results: Artist[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
  reset: () => void;
}

type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setResults: (results) =>
    set({
      results,
      isLoading: false,
      error: null,
      hasSearched: true,
    }),

  setLoading: (isLoading) => set({ isLoading, error: null }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
      results: [],
    }),

  clearSearch: () =>
    set({
      query: '',
      results: [],
      error: null,
      hasSearched: false,
    }),

  reset: () => set(initialState),
}));

