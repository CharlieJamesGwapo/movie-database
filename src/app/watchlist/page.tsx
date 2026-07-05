'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Movie } from '@/types';
import { getWatchlist } from '@/lib/localStorage';
import { getMovieDetails } from '@/lib/tmdb';
import { getUserPreferences } from '@/lib/localStorage';
import MovieCard from '@/components/MovieCard';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadWatchlist = async () => {
      try {
        const prefs = getUserPreferences();
        if (!prefs.apiKey) {
          setError('Please set your API key in settings');
          setLoading(false);
          return;
        }

        const watchlistItems = getWatchlist();
        if (watchlistItems.length === 0) {
          setLoading(false);
          return;
        }

        const movies = await Promise.all(
          watchlistItems.map((item) =>
            getMovieDetails(item.movieId, prefs.apiKey)
          )
        );

        setWatchlist(movies);
      } catch (err) {
        setError('Failed to load watchlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Watchlist</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} to watch
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Your watchlist is empty
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Find movies to watch
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
