import { useMemo, useState } from "react";
import type { Show } from "../movie/types";
import { useTMDB } from "../movie/useTMDB";
import { Navbar, Hero, GenreFilters, CarouselRow, Footer } from "./components";
import styles from "./dashboard.module.css";
import CatWindow from "./catWindow/CatWindow";
import TvSeries from "./tvSeries/TvSeries";

export default function Dashboard({
  onSignOut,
  onWatch,
  onInfo,
  onNavigate,
}: {
  onSignOut: () => void;
  onWatch: (show: Show) => void;
  onInfo: (show: Show) => void;
  onNavigate: (page: "account" | "profile" | "help") => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [genre, setGenre] = useState("All");
  const [view, setView] = useState<"home" | "catWindow" | "tvSeries">("home");

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

  if (view === "catWindow") {
    return <CatWindow onBack={() => setView("home")} />;
  }

  if (view === "tvSeries") {
    return <TvSeries onBack={() => setView("home")} />;
  }

  return (
    <div className={`min-h-screen ${styles.page}`}>
      <Navbar
        onSignOut={onSignOut}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onNavigatePage={onNavigate}
        onNavigateView={setView}
      />

      <main>
        {loading && (
          <div className="flex items-center justify-center" style={{ height: "78vh" }}>
            <p className={`text-sm animate-pulse ${styles.loadingText}`}>Loading StreamFlix…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 text-center" style={{ height: "78vh" }}>
            <p className={`text-sm font-semibold ${styles.errorText}`}>{error}</p>
            <p className={`text-xs ${styles.errorHint}`}>
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
