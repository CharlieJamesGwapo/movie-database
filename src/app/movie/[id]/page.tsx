'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie, Cast, Video, Recommendation } from '@/types';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getRecommendations,
  getBackdropUrl,
  getPosterUrl,
} from '@/lib/tmdb';
import {
  getUserPreferences,
  isFavorite,
  addFavorite,
  removeFavorite,
  isInWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  addReview,
  getAverageRating,
} from '@/lib/localStorage';
import CastGrid from '@/components/CastGrid';
import TrailerViewer from '@/components/TrailerViewer';
import ReviewsList from '@/components/ReviewsList';
import RecommendedMovies from '@/components/RecommendedMovies';
import RatingComponent from '@/components/RatingComponent';

interface MoviePageProps {
  params: { id: string };
}

export default function MoviePage({ params }: MoviePageProps) {
  const movieId = parseInt(params.id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFav, setIsFav] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
    const fetchMovieData = async () => {
      try {
        const prefs = getUserPreferences();
        if (!prefs.apiKey) {
          setError('Please set your API key in settings');
          setLoading(false);
          return;
        }

        const [movieData, castData, videosData, recommendationsData] =
          await Promise.all([
            getMovieDetails(movieId, prefs.apiKey),
            getMovieCredits(movieId, prefs.apiKey),
            getMovieVideos(movieId, prefs.apiKey),
            getRecommendations(movieId, prefs.apiKey),
          ]);

        setMovie(movieData);
        setCast(castData.cast);
        setVideos(videosData.results);
        setRecommendations(recommendationsData.results);

        setIsFav(isFavorite(movieId));
        setIsWatchlist(isInWatchlist(movieId));
        setAverageRating(getAverageRating(movieId));
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFavorite(movieId);
      setIsFav(false);
    } else {
      addFavorite(movieId);
      setIsFav(true);
    }
  };

  const handleWatchlistToggle = () => {
    if (isWatchlist) {
      removeFromWatchlist(movieId);
      setIsWatchlist(false);
    } else {
      addToWatchlist(movieId);
      setIsWatchlist(true);
    }
  };

  const handleAddReview = () => {
    if (userRating === 0 || !reviewText.trim()) {
      alert('Please provide both a rating and review text');
      return;
    }

    addReview(movieId, userRating, reviewText.trim());
    setReviewText('');
    setUserRating(0);
    setAverageRating(getAverageRating(movieId));
    alert('Review added successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">{error || 'Movie not found'}</p>
        <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  const rating = Math.round(movie.vote_average * 10) / 10;
  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="space-y-8">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          src={getBackdropUrl(movie.backdrop_path, 1280)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="flex gap-6 p-8 w-full">
            <div className="flex-shrink-0 hidden sm:block">
              <div className="relative w-48 h-72 rounded-lg overflow-hidden">
                <Image
                  src={getPosterUrl(movie.poster_path, 300)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-white pb-4">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm mb-4">
                <span>Year: {releaseYear}</span>
                {movie.runtime && <span>Runtime: {movie.runtime} min</span>}
                <span>Rating: ⭐ {rating}</span>
              </div>
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
              {mounted && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFavoriteToggle}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    {isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
                  </button>
                  <button
                    onClick={handleWatchlistToggle}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                  >
                    {isWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-700">
        {['overview', 'cast', 'videos', 'reviews', 'recommendations'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      <div>
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Synopsis</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.overview || 'No synopsis available'}
              </p>
            </div>

            {mounted && averageRating > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-2">User Rating</h3>
                <p className="text-lg">
                  {'⭐'.repeat(Math.round(averageRating))} ({averageRating}/5)
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cast' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Cast & Crew</h3>
            <CastGrid cast={cast} />
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Trailers & Clips</h3>
            <TrailerViewer videos={videos} />
          </div>
        )}

        {activeTab === 'reviews' && mounted && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-lg space-y-4">
                <div>
                  <label className="block font-medium mb-2">Your Rating</label>
                  <RatingComponent onRate={setUserRating} defaultRating={userRating} />
                </div>
                <div>
                  <label className="block font-medium mb-2">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                </div>
                <button
                  onClick={handleAddReview}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Submit Review
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">User Reviews</h3>
              <ReviewsList movieId={movieId} />
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
            <RecommendedMovies recommendations={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}
