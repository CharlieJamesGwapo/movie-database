import SearchBar from '@/components/SearchBar';
import TrendingCarousel from '@/components/TrendingCarousel';

export default function Home() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to Movie Database</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Search millions of movies, build your watchlist, and discover new favorites.
          </p>
        </div>
        <SearchBar />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Trending This Week</h2>
        <TrendingCarousel />
      </div>
    </div>
  );
}
