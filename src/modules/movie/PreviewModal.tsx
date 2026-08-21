import { useEffect, useState } from "react";
import type { Show } from "./types";
import { fetchTrailerKey, fetchSimilar } from "./tmdb";

// ─── Icons (kept inline/no extra deps, matching the rest of the app) ───────

function PlayIcon({ size = 16, color = "#0A0908" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <polygon points="3,2 13,8 3,14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MuteIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export default function PreviewModal({
  show,
  onClose,
  onSelect,
  onPlay,
}: {
  show: Show | null;
  onClose: () => void;
  /** Lets "More Like This" cards re-open the modal with a different title. */
  onSelect?: (show: Show) => void;
  /** Sends the viewer to the full watch screen. */
  onPlay?: (show: Show) => void;
}) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [similar, setSimilar] = useState<Show[]>([]);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      setTrailerKey(null);
      setSimilar([]);
      return;
    }
    let cancelled = false;
    setTrailerKey(null);
    setMuted(true);
    setLoadingTrailer(true);

    Promise.all([
      fetchTrailerKey(show.id, show.mediaType ?? "movie"),
      fetchSimilar(show.id, show.mediaType ?? "movie"),
    ]).then(([key, sim]) => {
      if (cancelled) return;
      setTrailerKey(key);
      setSimilar(sim);
      setLoadingTrailer(false);
    });

    return () => {
      cancelled = true;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:p-6 md:p-10"
      style={{ background: "rgba(10,9,8,0.85)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl my-4 md:my-8"
        style={{ background: "#0f0d0c", border: "1px solid rgba(94,80,63,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(10,9,8,0.7)", color: "#F2F4F3" }}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* ─── Trailer / hero media ─────────────────────────────────── */}
        <div className="relative w-full aspect-video" style={{ background: "#0A0908" }}>
          {trailerKey ? (
            <iframe
              key={trailerKey}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
                muted ? 1 : 0
              }&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1&rel=0&showinfo=0`}
              title={`${show.title} trailer`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <img
              src={show.hero ?? show.image}
              alt={show.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to top, #0f0d0c 0%, transparent 45%, rgba(10,9,8,0.3) 100%)" }}
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex items-end justify-between gap-3">
            <div>
              <h2
                className="uppercase leading-none tracking-tight mb-3 text-2xl md:text-4xl"
                style={{ color: "#F2F4F3", fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                {show.title}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => onPlay?.(show)}
                  className="flex items-center gap-2 px-5 md:px-6 py-2 rounded-lg font-bold hover:bg-[#d0d2d1] active:scale-[0.98] transition-all duration-150 text-sm md:text-base"
                  style={{ background: "#F2F4F3", color: "#0A0908", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}
                >
                  <PlayIcon />
                  Play
                </button>
                <button
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors"
                  style={{ borderColor: "#5E503F", color: "#F2F4F3", background: "rgba(10,9,8,0.4)" }}
                  aria-label="Add to list"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {trailerKey && (
              <button
                onClick={() => setMuted((m) => !m)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-colors flex-shrink-0"
                style={{ borderColor: "#5E503F", color: "#F2F4F3", background: "rgba(10,9,8,0.4)" }}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                <MuteIcon muted={muted} />
              </button>
            )}
          </div>
        </div>

        {/* ─── Details ────────────────────────────────────────────────── */}
        <div className="p-4 md:p-8" style={{ fontFamily: "var(--font-body)" }}>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {typeof show.match === "number" && (
                  <span className="font-semibold text-sm" style={{ color: "#49111C" }}>
                    {show.match}% Match
                  </span>
                )}
                <span className="text-sm" style={{ color: "#A9927D" }}>{show.year}</span>
                <span className="text-xs px-1.5 py-0.5 border rounded" style={{ color: "#A9927D", borderColor: "#5E503F" }}>
                  {show.rating}
                </span>
                {!trailerKey && !loadingTrailer && (
                  <span className="text-xs italic" style={{ color: "#5E503F" }}>
                    No trailer available
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "#F2F4F3" }}>
                {show.description || "No description available."}
              </p>
            </div>
            <div className="text-sm space-y-2" style={{ color: "#A9927D" }}>
              {show.genres.length > 0 && (
                <p>
                  <span style={{ color: "#5E503F" }}>Genres: </span>
                  {show.genres.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* More Like This */}
          {similar.length > 0 && (
            <div className="mt-8">
              <h3
                className="font-bold text-lg md:text-xl tracking-wide mb-4"
                style={{ color: "#F2F4F3", fontFamily: "var(--font-display)" }}
              >
                More Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {similar.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelect?.(s)}
                    className="cursor-pointer group rounded-lg overflow-hidden"
                    style={{ background: "#0A0908" }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <img
                        src={s.hero ?? s.image}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        {typeof s.match === "number" && (
                          <span className="text-xs font-semibold" style={{ color: "#49111C" }}>
                            {s.match}% Match
                          </span>
                        )}
                        <span className="text-xs px-1 border rounded" style={{ color: "#A9927D", borderColor: "#5E503F" }}>
                          {s.rating}
                        </span>
                      </div>
                      <p className="text-xs line-clamp-2" style={{ color: "#A9927D" }}>
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
