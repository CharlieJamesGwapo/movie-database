'use client';

import Image from 'next/image';
import { Cast } from '@/types';
import { getProfileUrl } from '@/lib/tmdb';

interface CastGridProps {
  cast: Cast[];
}

export default function CastGrid({ cast }: CastGridProps) {
  if (cast.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No cast information available</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cast.slice(0, 20).map((member) => (
        <div key={member.id} className="group">
          <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg mb-2 bg-gray-300 dark:bg-gray-700">
            <Image
              src={getProfileUrl(member.profile_path, 200)}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="200px"
            />
          </div>
          <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
            {member.name}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {member.character}
          </p>
        </div>
      ))}
    </div>
  );
}
