import { Movie, Cast, Video, Genre, Recommendation } from '@/types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function getApiKey(): Promise<string> {
  if (typeof window === 'undefined') return '';
  const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  return prefs.apiKey || '';
}

export async function searchMovies(
  query: string,
  page: number = 1,
  apiKey: string
): Promise<{ results: Movie[]; total_pages: number }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  return response.json();
}

export async function getTrendingMovies(
  apiKey: string,
  page: number = 1
): Promise<{ results: Movie[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }

  return response.json();
}

export async function getMovieDetails(
  movieId: number,
  apiKey: string
): Promise<Movie> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function getMovieCredits(
  movieId: number,
  apiKey: string
): Promise<{ cast: Cast[]; crew: any[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie credits');
  }

  return response.json();
}

export async function getMovieVideos(
  movieId: number,
  apiKey: string
): Promise<{ results: Video[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch movie videos');
  }

  return response.json();
}

export async function getRecommendations(
  movieId: number,
  apiKey: string
): Promise<{ results: Recommendation[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  return response.json();
}

export async function getGenres(apiKey: string): Promise<{ genres: Genre[] }> {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  return response.json();
}

export function getPosterUrl(posterPath: string | null | undefined, width: number = 300): string {
  if (!posterPath) {
    return '/placeholder-movie.png';
  }
  return `https://image.tmdb.org/t/p/w${width}${posterPath}`;
}

export function getBackdropUrl(
  backdropPath: string | null | undefined,
  width: number = 780
): string {
  if (!backdropPath) {
    return '/placeholder-backdrop.png';
  }
  return `https://image.tmdb.org/t/p/w${width}${backdropPath}`;
}

export function getProfileUrl(
  profilePath: string | null | undefined,
  width: number = 200
): string {
  if (!profilePath) {
    return '/placeholder-actor.png';
  }
  return `https://image.tmdb.org/t/p/w${width}${profilePath}`;
}

export function getYouTubeEmbedUrl(videoKey: string): string {
  return `https://www.youtube.com/embed/${videoKey}`;
}
