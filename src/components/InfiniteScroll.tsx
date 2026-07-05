'use client';

import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <div ref={observerTarget} className="py-8 text-center">
      {isLoading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
      {!hasMore && !isLoading && (
        <p className="text-gray-600 dark:text-gray-400">
          No more results to load
        </p>
      )}
    </div>
  );
}
