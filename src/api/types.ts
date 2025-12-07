// Last.fm API Response Types

export interface Image {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}

export interface Artist {
  name: string;
  mbid?: string;
  url: string;
  image?: Image[];
  streamable?: string;
  listeners?: string;
  playcount?: string;
}

export interface Track {
  name: string;
  duration?: string;
  playcount?: string;
  listeners?: string;
  mbid?: string;
  url: string;
  streamable?: {
    '#text': string;
    fulltrack: string;
  };
  artist: Artist | string;
  '@attr'?: {
    rank: string;
  };
}

export interface Album {
  name: string;
  artist: string | Artist;
  mbid?: string;
  url: string;
  image?: Image[];
  playcount?: string;
  '@attr'?: {
    rank?: string;
    position?: string;
  };
  tracks?: {
    track: Track | Track[];
  };
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
  tags?: {
    tag: Array<{ name: string; url: string }>;
  };
  listeners?: string;
}

export interface SearchResult {
  'opensearch:Query': {
    '#text': string;
    role: string;
    searchTerms: string;
    startPage: string;
  };
  'opensearch:totalResults': string;
  'opensearch:startIndex': string;
  'opensearch:itemsPerPage': string;
  artistmatches?: {
    artist: Artist[];
  };
  albummatches?: {
    album: Album[];
  };
  trackmatches?: {
    track: Track[];
  };
}

export interface LastFmApiResponse<T> {
  results?: T;
  error?: number;
  message?: string;
}

export interface TopArtistsResponse {
  artists: {
    artist: Artist[];
    '@attr': {
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface TopTracksResponse {
  tracks: {
    track: Track[];
    '@attr': {
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface ArtistTopAlbumsResponse {
  topalbums: {
    album: Album[];
    '@attr': {
      artist: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface AlbumInfoResponse {
  album: Album;
}

export interface ArtistSearchResponse {
  results: SearchResult & {
    'opensearch:Query': {
      '#text': string;
      role: string;
      searchTerms: string;
      startPage: string;
    };
    'opensearch:totalResults': string;
    'opensearch:startIndex': string;
    'opensearch:itemsPerPage': string;
    artistmatches: {
      artist: Artist[];
    };
  };
}

