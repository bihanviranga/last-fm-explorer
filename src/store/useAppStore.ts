import { create } from 'zustand';
import type { Artist, Album, Track } from '../api/types';

interface PopularContent {
  topArtists: Artist[];
  topTracks: Track[];
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  selectedArtist: Artist | null;
  popularContent: PopularContent;
  // Cache for album data to avoid refetching
  albumCache: Record<string, Album[]>;
}

interface AppActions {
  setSelectedArtist: (artist: Artist | null) => void;
  setTopArtists: (artists: Artist[]) => void;
  setTopTracks: (tracks: Track[]) => void;
  setPopularContentLoading: (isLoading: boolean) => void;
  setPopularContentError: (error: string | null) => void;
  cacheAlbums: (artistName: string, albums: Album[]) => void;
  getCachedAlbums: (artistName: string) => Album[] | null;
  clearCache: () => void;
  reset: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  selectedArtist: null,
  popularContent: {
    topArtists: [],
    topTracks: [],
    isLoading: false,
    error: null,
  },
  albumCache: {},
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  setSelectedArtist: (artist) => set({ selectedArtist: artist }),

  setTopArtists: (artists) =>
    set((state) => ({
      popularContent: {
        ...state.popularContent,
        topArtists: artists,
        isLoading: false,
        error: null,
      },
    })),

  setTopTracks: (tracks) =>
    set((state) => ({
      popularContent: {
        ...state.popularContent,
        topTracks: tracks,
        isLoading: false,
        error: null,
      },
    })),

  setPopularContentLoading: (isLoading) =>
    set((state) => ({
      popularContent: {
        ...state.popularContent,
        isLoading,
        error: null,
      },
    })),

  setPopularContentError: (error) =>
    set((state) => ({
      popularContent: {
        ...state.popularContent,
        error,
        isLoading: false,
      },
    })),

  cacheAlbums: (artistName, albums) =>
    set((state) => ({
      albumCache: {
        ...state.albumCache,
        [artistName.toLowerCase()]: albums,
      },
    })),

  getCachedAlbums: (artistName) => {
    const cache = get().albumCache;
    return cache[artistName.toLowerCase()] || null;
  },

  clearCache: () => set({ albumCache: {} }),

  reset: () => set(initialState),
}));

