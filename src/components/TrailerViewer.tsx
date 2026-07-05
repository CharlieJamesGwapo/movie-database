'use client';

import { Video } from '@/types';
import { getYouTubeEmbedUrl } from '@/lib/tmdb';
import { useState } from 'react';

interface TrailerViewerProps {
  videos: Video[];
}

export default function TrailerViewer({ videos }: TrailerViewerProps) {
  const trailers = videos.filter(
    (v) =>
      v.site === 'YouTube' &&
      (v.type === 'Trailer' ||
        v.type === 'Teaser' ||
        v.type === 'Clip' ||
        v.type === 'Featurette')
  );

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (trailers.length === 0) {
    return (
      <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No trailers or clips available</p>
      </div>
    );
  }

  const selectedVideo = trailers[selectedVideoIndex];

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          width="100%"
          height="100%"
          src={getYouTubeEmbedUrl(selectedVideo.key)}
          title={selectedVideo.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>

      {trailers.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {trailers.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideoIndex(index)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                index === selectedVideoIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
            >
              {video.type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
