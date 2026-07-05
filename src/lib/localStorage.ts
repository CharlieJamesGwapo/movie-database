import {
  UserPreferences,
  FavoriteItem,
  WatchlistItem,
  Review,
} from '@/types';

const PREFERENCES_KEY = 'userPreferences';
const FAVORITES_KEY = 'favorites';
const WATCHLIST_KEY = 'watchlist';
const REVIEWS_KEY = 'reviews';

// Preferences
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return getDefaultPreferences();
  const stored = localStorage.getItem(PREFERENCES_KEY);
  return stored
    ? JSON.parse(stored)
    : getDefaultPreferences();
}

export function getDefaultPreferences(): UserPreferences {
  return {
    apiKey: '',
    theme: 'dark',
    sortBy: 'popularity',
  };
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

// Favorites
export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function isFavorite(movieId: number): boolean {
  return getFavorites().some((fav) => fav.movieId === movieId);
}

export function addFavorite(movieId: number): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.some((fav) => fav.movieId === movieId)) {
    favorites.push({ movieId, addedAt: Date.now() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(movieId: number): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites().filter((fav) => fav.movieId !== movieId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Watchlist
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function isInWatchlist(movieId: number): boolean {
  return getWatchlist().some((item) => item.movieId === movieId);
}

export function addToWatchlist(movieId: number): void {
  if (typeof window === 'undefined') return;
  const watchlist = getWatchlist();
  if (!watchlist.some((item) => item.movieId === movieId)) {
    watchlist.push({ movieId, addedAt: Date.now() });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
}

export function removeFromWatchlist(movieId: number): void {
  if (typeof window === 'undefined') return;
  const watchlist = getWatchlist().filter((item) => item.movieId !== movieId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}

// Reviews
export function getReviews(movieId: number): Review[] {
  if (typeof window === 'undefined') return [];
  const allReviews = getAllReviews();
  return allReviews.filter((review) => review.movieId === movieId);
}

export function getAllReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REVIEWS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addReview(
  movieId: number,
  rating: number,
  text: string,
  author: string = 'Anonymous'
): Review {
  if (typeof window === 'undefined') throw new Error('Cannot use localStorage on server');

  const review: Review = {
    id: Date.now().toString(),
    movieId,
    rating,
    text,
    createdAt: Date.now(),
    author,
  };

  const reviews = getAllReviews();
  reviews.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));

  return review;
}

export function deleteReview(reviewId: string): void {
  if (typeof window === 'undefined') return;
  const reviews = getAllReviews().filter((r) => r.id !== reviewId);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getAverageRating(movieId: number): number {
  const reviews = getReviews(movieId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((total / reviews.length).toFixed(1));
}
