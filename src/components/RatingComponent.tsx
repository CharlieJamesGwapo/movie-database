'use client';

import { useState } from 'react';

interface RatingComponentProps {
  onRate: (rating: number) => void;
  defaultRating?: number;
}

export default function RatingComponent({
  onRate,
  defaultRating = 0,
}: RatingComponentProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(defaultRating);

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="text-3xl transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          {star <= (hoveredRating || selectedRating) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}
