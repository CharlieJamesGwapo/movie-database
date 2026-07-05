'use client';

import { useEffect, useState } from 'react';
import { getUserPreferences, saveUserPreferences } from '@/lib/localStorage';
import { UserPreferences } from '@/types';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    getUserPreferences()
  );
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    saveUserPreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your Movie Database experience
        </p>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg space-y-6">
        <div className="border-b border-gray-300 dark:border-gray-700 pb-6">
          <h2 className="text-2xl font-bold mb-4">TMDB API Configuration</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get your free API key from{' '}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              TMDB API Settings
            </a>
          </p>
          <div>
            <label className="block font-medium mb-2">API Key</label>
            <input
              type="password"
              value={preferences.apiKey}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  apiKey: e.target.value,
                })
              }
              placeholder="Enter your TMDB API key"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Your API key is stored locally in your browser. We never send it to our servers.
            </p>
          </div>
        </div>

        <div className="border-b border-gray-300 dark:border-gray-700 pb-6">
          <h2 className="text-2xl font-bold mb-4">Display Preferences</h2>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    theme: e.target.value as 'light' | 'dark',
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Default Sort</label>
              <select
                value={preferences.sortBy}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    sortBy: e.target.value as
                      | 'popularity'
                      | 'rating'
                      | 'release_date',
                  })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="release_date">Release Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Data Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All your favorites, watchlist, and reviews are stored in your browser's local storage.
          </p>

          <button
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to clear all your local data? This cannot be undone.'
                )
              ) {
                localStorage.clear();
                setPreferences(getUserPreferences());
                alert('All data has been cleared');
              }
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Clear All Data
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Save Settings
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span>✓ Settings saved successfully</span>
          </div>
        )}
      </div>

      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <p className="font-medium mb-2">Privacy Note</p>
        <p>
          This app is client-side only. Your API key and all personal data (favorites,
          watchlist, reviews) are stored exclusively in your browser and never sent to any external
          servers except TMDB for fetching movie data.
        </p>
      </div>
    </div>
  );
}
