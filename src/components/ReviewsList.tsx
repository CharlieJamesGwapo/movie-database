'use client';

import { Review } from '@/types';
import { getReviews, deleteReview as deleteStoredReview } from '@/lib/localStorage';
import { useEffect, useState } from 'react';

interface ReviewsListProps {
  movieId: number;
}

export default function ReviewsList({ movieId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadReviews();
  }, [movieId]);

  const loadReviews = () => {
    const movieReviews = getReviews(movieId);
    setReviews(movieReviews.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleDelete = (reviewId: string) => {
    deleteStoredReview(reviewId);
    loadReviews();
  };

  if (!mounted) return null;

  if (reviews.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
        No reviews yet. Be the first to review this movie!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {review.author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {'⭐'.repeat(review.rating)} ({review.rating}/5)
              </p>
            </div>
            <button
              onClick={() => handleDelete(review.id)}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Delete
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
