'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import InfiniteScroll from '@/components/InfiniteScroll';
import { Movie } from '@/types';
import { searchMovies } from '@/lib/tmdb';
import { getUserPreferences } from '@/lib/localStorage';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const prefs = getUserPreferences();
        if (!prefs.apiKey) {
          setError('Please set your API key in settings');
          setLoading(false);
          return;
        }

        const data = await searchMovies(query, 1, prefs.apiKey);
        setResults(data.results);
        setTotalPages(data.total_pages);
        setCurrentPage(1);
        setHasSearched(true);
      } catch (err) {
        setError('Failed to search movies. Please try again.');
        console.error(err);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) return;

    try {
      const prefs = getUserPreferences();
      const data = await searchMovies(query, nextPage, prefs.apiKey);
      setResults((prev) => [...prev, ...data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <SearchBar initialQuery={query} />

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No movies found for "{query}"
          </p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Search Results for "{query}"
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {results.length} movies
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {currentPage < totalPages && (
            <InfiniteScroll
              onLoadMore={handleLoadMore}
              hasMore={currentPage < totalPages}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
