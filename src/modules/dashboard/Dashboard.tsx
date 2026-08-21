import { useMemo, useState } from "react";
import type { Show } from "../movie/types";
import { useTMDB } from "../movie/useTMDB";
import { Navbar, Hero, GenreFilters, CarouselRow, Footer } from "./components";

export default function Dashboard({
  onSignOut,
  onWatch,
  onInfo,
}: {
  onSignOut: () => void;
  onWatch: (show: Show) => void;
  onInfo: (show: Show) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [genre, setGenre] = useState("All");

  const {
    featured,
    trending,
    newReleases,
    action,
    drama,
    scifi,
    horror,
    comedy,
    acclaimed,
    topTen,
    continueWatching,
    recommended,
    loading,
    error,
  } = useTMDB();

  const byGenre = (list: (Show & { progress?: number })[]) =>
    genre === "All" ? list : list.filter((s) => s.genres.includes(genre));

  const rows = useMemo(
    () => [
      { title: "Continue Watching", shows: continueWatching, showProgress: true },
      { title: "Top 10 in Your Country Today", shows: topTen, top10: true },
      { title: "Trending Now", shows: byGenre(trending) },
      { title: "New Releases", shows: byGenre(newReleases), exploreAll: true },
      { title: "Action & Thriller", shows: byGenre(action) },
      { title: "Drama", shows: byGenre(drama) },
      { title: "Sci-Fi", shows: byGenre(scifi) },
      { title: "Horror", shows: byGenre(horror) },
      { title: "Comedy", shows: byGenre(comedy) },
      { title: "Critically Acclaimed", shows: byGenre(acclaimed) },
      { title: "Recommended TV Shows", shows: recommended, exploreAll: true },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [genre, trending, newReleases, action, drama, scifi, horror, comedy, acclaimed, topTen, continueWatching, recommended],
  );

  return (
    <div className="min-h-screen" style={{ background: "#0A0908" }}>
      <Navbar onSignOut={onSignOut} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

      <main>
        {loading && (
          <div className="flex items-center justify-center" style={{ height: "78vh", color: "#A9927D" }}>
            <p className="text-sm animate-pulse" style={{ fontFamily: "var(--font-body)" }}>Loading StreamFlix…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ height: "78vh" }}>
            <p className="text-sm font-semibold" style={{ color: "#e50914" }}>{error}</p>
            <p className="text-xs" style={{ color: "#5E503F" }}>
              Get a free API key at themoviedb.org and swap it into src/modules/movie/tmdb.ts.
            </p>
          </div>
        )}

        {!loading && !error && featured && (
          <>
            <Hero show={featured} onWatch={onWatch} onInfo={onInfo} />
            <GenreFilters active={genre} setActive={setGenre} />

            <div className="flex flex-col gap-10 pb-4">
              {rows.map((row) => (
                <CarouselRow
                  key={row.title}
                  title={row.title}
                  shows={row.shows}
                  showProgress={row.showProgress}
                  top10={row.top10}
                  exploreAll={row.exploreAll}
                  onPlay={onWatch}
                  onInfo={onInfo}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
