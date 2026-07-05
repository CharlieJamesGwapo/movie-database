'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types';
import { getTrendingMovies, getBackdropUrl, getPosterUrl } from '@/lib/tmdb';
import { getUserPreferences } from '@/lib/localStorage';

export default function TrendingCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const prefs = getUserPreferences();
        if (!prefs.apiKey) {
          setError('Please set your API key in settings');
          setLoading(false);
          return;
        }

        const data = await getTrendingMovies(prefs.apiKey);
        setMovies(data.results.slice(0, 10));
      } catch (err) {
        setError('Failed to load trending movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  if (error || movies.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">{error || 'No trending movies found'}</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const rating = Math.round(currentMovie.vote_average * 10) / 10;

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden group">
      <div className="relative w-full h-full">
        <Image
          src={getBackdropUrl(currentMovie.backdrop_path, 1280)}
          alt={currentMovie.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 text-white max-w-lg">
        <h2 className="text-4xl font-bold mb-2">{currentMovie.title}</h2>
        <p className="text-sm text-gray-300 mb-4">
          Release: {new Date(currentMovie.release_date).getFullYear()} | Rating: ⭐ {rating}
        </p>
        <p className="text-gray-200 line-clamp-3 mb-4">{currentMovie.overview}</p>
        <Link
          href={`/movie/${currentMovie.id}`}
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          View Details
        </Link>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Previous slide"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Next slide"
      >
        ❯
      </button>

      <div className="absolute bottom-4 right-8 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
