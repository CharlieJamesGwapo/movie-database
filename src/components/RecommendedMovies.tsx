'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Recommendation } from '@/types';
import { getPosterUrl } from '@/lib/tmdb';

interface RecommendedMoviesProps {
  recommendations: Recommendation[];
}

export default function RecommendedMovies({
  recommendations,
}: RecommendedMoviesProps) {
  if (recommendations.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No recommendations available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {recommendations.slice(0, 15).map((movie) => {
        const rating = Math.round(movie.vote_average * 10) / 10;

        return (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="relative w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700">
              <Image
                src={getPosterUrl(movie.poster_path, 300)}
                alt={movie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="300px"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <h4 className="font-bold line-clamp-2 mb-1">{movie.title}</h4>
              <span className="text-sm font-semibold">⭐ {rating}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
