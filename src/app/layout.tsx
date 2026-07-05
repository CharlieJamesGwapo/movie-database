import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Database",
  description: "Search and discover movies with TMDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                🎬 MovieDB
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/favorites"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  Favorites
                </Link>
                <Link
                  href="/watchlist"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  Watchlist
                </Link>
                <Link
                  href="/settings"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  Settings
                </Link>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>Built by Charlie James | Data from TMDB API</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
