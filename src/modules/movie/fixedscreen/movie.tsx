import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTVEpisodes, type TMDBEpisode } from "../tmdb";
import styles from "./movie.module.css";

interface WatchProps {
	id: number;
	title: string;
	year: string;
	rating: string;
	match: number;
	backgroundImage: string;
	isSeries?: boolean;
	onBack: () => void;
}

type ReactionKey = "upvote" | "funny" | "love" | "surprised" | "angry" | "sad";

const REACTIONS: Array<[ReactionKey, string, string]> = [
	["upvote", "👍", "Upvote"],
	["funny", "😂", "Funny"],
	["love", "❤️", "Love"],
	["surprised", "😮", "Surprised"],
	["angry", "😡", "Angry"],
	["sad", "😢", "Sad"],
];
const MOVIE_FALLBACK_SECONDS = 2 * 60 * 60;

function loadProgress(): Record<string, number> {
	try {
		return JSON.parse(localStorage.getItem("sf_progress") || "{}");
	} catch {
		return {};
	}
}

function saveProgress(progress: Record<string, number>) {
	localStorage.setItem("sf_progress", JSON.stringify(progress));
}

function formatTime(seconds: number) {
	const safe = Math.max(0, Math.floor(seconds));
	const hours = Math.floor(safe / 3600);
	const minutes = Math.floor((safe % 3600) / 60);
	const secs = safe % 60;
	return hours > 0
		? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
		: `${minutes}:${String(secs).padStart(2, "0")}`;
}

function durationSeconds(duration: string) {
	const minutes = Number.parseInt(duration, 10);
	return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 : 45 * 60;
}

function PlayerIcon({ playing }: { playing: boolean }) {
	return playing ? (
		<span aria-hidden="true">❚❚</span>
	) : (
		<span aria-hidden="true">▶</span>
	);
}

export default function WatchScreen({
	id,
	title,
	year,
	rating,
	match,
	backgroundImage,
	isSeries = false,
	onBack,
}: WatchProps) {
	const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
	const [selectedEpisode, setSelectedEpisode] = useState<TMDBEpisode | null>(
		null,
	);
	const [episodesLoading, setEpisodesLoading] = useState(false);
	const [episodesError, setEpisodesError] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [volume, setVolume] = useState(80);
	const [muted, setMuted] = useState(false);
	const [captions, setCaptions] = useState(false);
	const [progress, setProgress] =
		useState<Record<string, number>>(loadProgress);
	const [myReaction, setMyReaction] = useState<ReactionKey | null>(null);
	const [reactionCounts, setReactionCounts] = useState<
		Record<ReactionKey, number>
	>({
		upvote: 0,
		funny: 0,
		love: 0,
		surprised: 0,
		angry: 0,
		sad: 0,
	});
	const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		let active = true;
		setPlaying(false);
		setSelectedEpisode(null);
		setEpisodes([]);
		setEpisodesError(false);
		if (!isSeries)
			return () => {
				active = false;
			};

		setEpisodesLoading(true);
		fetchTVEpisodes(id)
			.then((items) => {
				if (!active) return;
				setEpisodes(items);
				setSelectedEpisode(items[0] ?? null);
				setEpisodesError(items.length === 0);
			})
			.catch(() => {
				if (active) setEpisodesError(true);
			})
			.finally(() => {
				if (active) setEpisodesLoading(false);
			});
		return () => {
			active = false;
		};
	}, [id, isSeries]);

	const contentId =
		isSeries && selectedEpisode
			? `tv-${id}-episode-${selectedEpisode.ep}`
			: `movie-${id}`;
	const duration =
		isSeries && selectedEpisode
			? durationSeconds(selectedEpisode.duration)
			: MOVIE_FALLBACK_SECONDS;
	const current = progress[contentId] ?? 0;
	const percent = duration > 0 ? Math.min((current / duration) * 100, 100) : 0;
	const watched = percent >= 95;
	const playerImage = selectedEpisode?.thumb || backgroundImage;

	useEffect(() => {
		if (!playing) return;
		const timer = window.setInterval(() => {
			setProgress((previous) => {
				const next = {
					...previous,
					[contentId]: Math.min((previous[contentId] ?? 0) + 1, duration),
				};
				saveProgress(next);
				return next;
			});
		}, 1000);
		return () => window.clearInterval(timer);
	}, [contentId, duration, playing]);

	useEffect(
		() => () => {
			if (controlsTimer.current) clearTimeout(controlsTimer.current);
		},
		[],
	);

	const totalReactions = useMemo(
		() =>
			Object.values(reactionCounts).reduce(
				(total, count) => total + count,
				0,
			),
		[reactionCounts],
	);

	const seekTo = (seconds: number) => {
		const nextTime = Math.max(0, Math.min(seconds, duration));
		setProgress((previous) => {
			const next = { ...previous, [contentId]: nextTime };
			saveProgress(next);
			return next;
		});
	};

	const revealControls = () => {
		setShowControls(true);
		if (controlsTimer.current) clearTimeout(controlsTimer.current);
		if (playing)
			controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
	};

	const selectEpisode = (episode: TMDBEpisode) => {
		setSelectedEpisode(episode);
		setPlaying(false);
		setShowControls(true);
	};

	const react = (key: ReactionKey) => {
		setReactionCounts((previous) => {
			const next = { ...previous };
			if (myReaction) next[myReaction] = Math.max(0, next[myReaction] - 1);
			if (myReaction !== key) next[key] += 1;
			return next;
		});
		setMyReaction((previous) => (previous === key ? null : key));
	};

	return (
		<div className={styles.page}>
			<nav className={styles.nav}>
				<div className={styles.navInner}>
					<button
						type="button"
						className={styles.backButton}
						onClick={onBack}
					>
						<span aria-hidden="true">‹</span> Back
					</button>
					<span className={styles.logo}>STREAMFLIX</span>
					<span className={styles.navSpacer} aria-hidden="true" />
				</div>
			</nav>

			<main className={styles.main}>
				<section
					className={`${styles.player} ${showControls ? "" : styles.hideCursor}`}
					onMouseMove={revealControls}
					onMouseLeave={() => playing && setShowControls(false)}
					onClick={() => setPlaying((value) => !value)}
				>
					{playerImage ? (
						<img
							src={playerImage}
							alt=""
							className={styles.playerImage}
						/>
					) : (
						<div className={styles.playerFallback}>🎬</div>
					)}
					<div className={styles.playerGradient} />
					{current > 30 && !playing && (
						<span className={styles.continueBadge}>
							{watched
								? "✓ Watched"
								: `Continue from ${formatTime(current)}`}
						</span>
					)}

					<div
						className={`${styles.controls} ${showControls ? styles.controlsVisible : ""}`}
					>
						<div className={styles.centerControls}>
							<button
								type="button"
								onClick={(event) => {
									event.stopPropagation();
									seekTo(current - 10);
								}}
							>
								−10
							</button>
							<button
								type="button"
								className={styles.playButton}
								aria-label={playing ? "Pause" : "Play"}
								onClick={(event) => {
									event.stopPropagation();
									setPlaying((value) => !value);
								}}
							>
								<PlayerIcon playing={playing} />
							</button>
							<button
								type="button"
								onClick={(event) => {
									event.stopPropagation();
									seekTo(current + 10);
								}}
							>
								+10
							</button>
						</div>

						<div
							className={styles.bottomControls}
							onClick={(event) => event.stopPropagation()}
						>
							<div
								className={styles.scrubber}
								onClick={(event) => {
									const bounds =
										event.currentTarget.getBoundingClientRect();
									seekTo(
										((event.clientX - bounds.left) / bounds.width) *
											duration,
									);
								}}
							>
								<span
									className={styles.scrubberFill}
									style={{ width: `${percent}%` }}
								/>
								<span
									className={styles.scrubberThumb}
									style={{ left: `${percent}%` }}
								/>
							</div>
							<div className={styles.controlRow}>
								<div className={styles.controlGroup}>
									<button
										type="button"
										aria-label={playing ? "Pause" : "Play"}
										onClick={() => setPlaying((value) => !value)}
									>
										<PlayerIcon playing={playing} />
									</button>
									<span>
										{formatTime(current)} / {formatTime(duration)}
									</span>
									<button
										type="button"
										aria-label={muted ? "Unmute" : "Mute"}
										onClick={() => setMuted((value) => !value)}
									>
										{muted ? "🔇" : "🔊"}
									</button>
									<input
										type="range"
										min="0"
										max="100"
										value={muted ? 0 : volume}
										aria-label="Volume"
										onChange={(event) => {
											setVolume(Number(event.target.value));
											setMuted(false);
										}}
									/>
								</div>
								<div className={styles.controlGroup}>
									<button
										type="button"
										className={captions ? styles.activeControl : ""}
										onClick={() => setCaptions((value) => !value)}
									>
										CC
									</button>
									<button type="button" aria-label="Player settings">
										⚙
									</button>
									<button type="button" aria-label="Fullscreen">
										⛶
									</button>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.contentInfo}>
					<h1>{title}</h1>
					{isSeries && selectedEpisode && (
						<p>
							Episode {selectedEpisode.ep} · {selectedEpisode.title} ·{" "}
							{selectedEpisode.duration || "Runtime unavailable"}
						</p>
					)}
					<div className={styles.metadata}>
						{match > 0 && <strong>{match}% Match</strong>}
						{year && <span>{year}</span>}
						{rating && <span className={styles.rating}>{rating}</span>}
					</div>
					{current > 5 && (
						<div className={styles.savedProgress}>
							<span style={{ width: `${percent}%` }} />
							<p>
								{watched
									? "✓ Watched"
									: `${Math.round(percent)}% watched · ${formatTime(duration - current)} remaining`}
							</p>
						</div>
					)}
				</section>

				{isSeries && (
					<section className={styles.episodesSection}>
						<h2>Episodes</h2>
						{episodesLoading && (
							<p className={styles.status}>
								Loading episodes from TMDB…
							</p>
						)}
						{episodesError && !episodesLoading && (
							<p className={styles.status}>
								Episode information is currently unavailable.
							</p>
						)}
						<div className={styles.episodeList}>
							{episodes.map((episode) => {
								const key = `tv-${id}-episode-${episode.ep}`;
								const episodeDuration = durationSeconds(
									episode.duration,
								);
								const episodeProgress = progress[key] ?? 0;
								const episodePercent = Math.min(
									(episodeProgress / episodeDuration) * 100,
									100,
								);
								const selected = selectedEpisode?.ep === episode.ep;
								return (
									<button
										type="button"
										key={episode.ep}
										className={`${styles.episodeRow} ${selected ? styles.episodeSelected : ""}`}
										onClick={() => selectEpisode(episode)}
									>
										<div className={styles.episodeThumb}>
											{episode.thumb ? (
												<img src={episode.thumb} alt="" />
											) : (
												<span>E{episode.ep}</span>
											)}
											{selected && <em>▶ NOW</em>}
											{episodeProgress > 0 && (
												<i
													style={{ width: `${episodePercent}%` }}
												/>
											)}
										</div>
										<div className={styles.episodeInfo}>
											<div>
												<strong>
													{episode.ep}. {episode.title}
												</strong>
												{selected && <small>Now Playing</small>}
											</div>
											<p>
												{episode.duration || "Runtime unavailable"}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</section>
				)}

				<section className={styles.reactions}>
					<h2>
						What did you think of this {isSeries ? "episode" : "movie"}?
					</h2>
					<p>{totalReactions} reactions</p>
					<div>
						{REACTIONS.map(([key, emoji, label]) => (
							<button
								type="button"
								key={key}
								className={
									myReaction === key ? styles.selectedReaction : ""
								}
								onClick={() => react(key)}
							>
								<span>{emoji}</span>
								<strong>{reactionCounts[key]}</strong>
								<small>{label}</small>
							</button>
						))}
					</div>
				</section>

				<section className={styles.comments}>
					<h2>0 Comments</h2>
					<div className={styles.commentComposer}>
						<textarea
							rows={2}
							placeholder="Write a comment…"
							aria-label="Write a comment"
						/>
						<button type="button">Post Comment</button>
					</div>
					<div className={styles.emptyComments}>
						<strong>No comments yet</strong>
						<p>Be the first to share your thoughts.</p>
					</div>
				</section>
			</main>
		</div>
	);
}
