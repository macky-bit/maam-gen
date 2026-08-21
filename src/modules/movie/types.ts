export interface Show {
  id: number;
  title: string;
  year: string;
  rating: string;
  duration: string;
  genres: string[];
  image: string;
  hero?: string;
  description?: string;
  match?: number;
  /** "movie" or "tv" — needed to hit the right TMDB endpoints (videos, similar, etc). */
  mediaType?: "movie" | "tv";
}

export interface TMDBData {
  featured: Show | null;
  trending: Show[];
  newReleases: Show[];
  action: Show[];
  drama: Show[];
  scifi: Show[];
  horror: Show[];
  comedy: Show[];
  acclaimed: Show[];
  topTen: Show[];
  continueWatching: (Show & { progress: number })[];
  recommended: Show[];
  loading: boolean;
  error: string | null;
}
