export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime?: number;
  genres?: Genre[];
  backdrop_path?: string | null;
  popularity?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order?: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface Review {
  id: string;
  movieId: number;
  rating: number;
  text: string;
  createdAt: number;
  author: string;
}

export interface UserPreferences {
  apiKey: string;
  theme: 'light' | 'dark';
  sortBy: 'popularity' | 'rating' | 'release_date';
}

export interface FavoriteItem {
  movieId: number;
  addedAt: number;
}

export interface WatchlistItem {
  movieId: number;
  addedAt: number;
}

export interface Recommendation {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}
