'use client';

import { Suspense } from 'react';
import SearchPageContent from './content';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
