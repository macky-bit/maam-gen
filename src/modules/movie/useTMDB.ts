import { useEffect, useState } from "react";
import { tmdb, toShow } from "./tmdb";
import type { TMDBData } from "./types";

export function useTMDB(): TMDBData {
  const [state, setState] = useState<TMDBData>({
    featured: null,
    trending: [],
    newReleases: [],
    action: [],
    drama: [],
    scifi: [],
    horror: [],
    comedy: [],
    acclaimed: [],
    topTen: [],
    continueWatching: [],
    recommended: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          trendingRaw,
          newRaw,
          actionRaw,
          dramaRaw,
          scifiRaw,
          horrorRaw,
          comedyRaw,
          topRatedRaw,
          tvRaw,
        ] = await Promise.all([
          tmdb("/trending/movie/week"),
          tmdb("/movie/now_playing"),
          tmdb("/discover/movie", { with_genres: "28,53", sort_by: "popularity.desc" }),
          tmdb("/discover/movie", { with_genres: "18", sort_by: "popularity.desc" }),
          tmdb("/discover/movie", { with_genres: "878", sort_by: "popularity.desc" }),
          tmdb("/discover/movie", { with_genres: "27", sort_by: "popularity.desc" }),
          tmdb("/discover/movie", { with_genres: "35", sort_by: "popularity.desc" }),
          tmdb("/movie/top_rated"),
          tmdb("/trending/tv/week"),
        ]);

        if (cancelled) return;

        const trending = trendingRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const newReleases = newRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const action = actionRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const drama = dramaRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const scifi = scifiRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const horror = horrorRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const comedy = comedyRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const acclaimed = topRatedRaw.map((m) => toShow(m, false, "movie")).slice(0, 8);
        const topTen = trending.slice(0, 8);
        const recommended = tvRaw.map((m) => toShow(m, false, "tv")).slice(0, 8);

        // Hero banner = first trending movie, with its backdrop
        const heroRaw = trendingRaw[0];
        const featured = heroRaw ? toShow(heroRaw, true, "movie") : null;

        // Fake "continue watching" from a mix of rows with made-up progress
        const continueWatching = [
          ...trending.slice(1, 4),
          ...newReleases.slice(0, 3),
        ].map((s, i) => ({ ...s, progress: [68, 32, 85, 15, 50, 74][i] ?? 40 }));

        setState({
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
          loading: false,
          error: null,
        });
      } catch {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load content from TMDB. Check your connection or API key.",
        }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
