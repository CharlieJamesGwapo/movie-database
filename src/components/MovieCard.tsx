'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types';
import { getPosterUrl } from '@/lib/tmdb';
import { useState, useEffect } from 'react';
import { isFavorite, addFavorite, removeFavorite } from '@/lib/localStorage';

interface MovieCardProps {
  movie: Movie;
  showActions?: boolean;
}

export default function MovieCard({
  movie,
  showActions = true,
}: MovieCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsFav(isFavorite(movie.id));
  }, [movie.id]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
    } else {
      addFavorite(movie.id);
      setIsFav(true);
    }
  };

  const rating = Math.round(movie.vote_average * 10) / 10;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
    >
      <div className="relative w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700">
        <Image
          src={getPosterUrl(movie.poster_path, 300)}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
        <h3 className="font-bold line-clamp-2 mb-2">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">⭐ {rating}</span>
          {showActions && mounted && (
            <button
              onClick={handleFavoriteToggle}
              className="text-lg"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
