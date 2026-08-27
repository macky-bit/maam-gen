import { useEffect, useState } from "react";
import { fetchTVEpisodes, type TMDBEpisode } from "./tmdb";
import styles from "./movie.module.css";

// ─── Logo ─────────────────────────────────────────────────────────────────────

const LOGO_SVG = (
	<svg
		viewBox="0 0 111.81 30"
		className="h-6 w-auto fill-[var(--color-red)]"
		aria-label="StreamFlix"
	>
		<path d="M0.66 22.02V20.82H3.78V22.26Q3.78 24.3 5.49 24.3Q6.33 24.3 6.765 23.805Q7.2 23.31 7.2 22.2Q7.2 20.88 6.6 19.875Q6.0 18.87 4.38 17.46Q2.34 15.66 1.53 14.205Q0.72 12.75 0.72 10.92Q0.72 8.43 1.98 7.065Q3.24 5.7 5.64 5.7Q8.01 5.7 9.225 7.065Q10.44 8.43 10.44 10.98V11.85H7.32V10.77Q7.32 9.69 6.9 9.195Q6.48 8.7 5.67 8.7Q4.02 8.7 4.02 10.71Q4.02 11.85 4.635 12.84Q5.25 13.83 6.87 15.24Q8.94 17.04 9.72 18.51Q10.5 19.98 10.5 21.96Q10.5 24.54 9.225 25.92Q7.95 27.3 5.52 27.3Q3.12 27.3 1.89 25.935Q0.66 24.57 0.66 22.02Z M14.97 9.0H11.52V6.0H21.72V9.0H18.27V27.0H14.97Z M23.31 6.0H28.2Q30.75 6.0 31.92 7.185Q33.09 8.37 33.09 10.83V12.12Q33.09 15.39 30.93 16.26V16.32Q32.13 16.68 32.625 17.79Q33.12 18.9 33.12 20.76V24.45Q33.12 25.35 33.18 25.905Q33.24 26.46 33.48 27.0H30.12Q29.94 26.49 29.88 26.04Q29.82 25.59 29.82 24.42V20.58Q29.82 19.14 29.355 18.57Q28.89 18.0 27.75 18.0H26.61V27.0H23.31ZM27.81 15.0Q28.8 15.0 29.295 14.49Q29.79 13.98 29.79 12.78V11.16Q29.79 10.02 29.385 9.51Q28.98 9.0 28.11 9.0H26.61V15.0Z M35.4 6.0H44.4V9.0H38.7V14.55H43.23V17.55H38.7V24.0H44.4V27.0H35.4Z M48.84 6.0H53.31L56.73 27.0H53.43L52.83 22.83V22.89H49.08L48.48 27.0H45.42ZM52.44 20.04 50.97 9.66H50.91L49.47 20.04Z M58.32 6.0H63.03L65.13 21.03H65.19L67.29 6.0H72.0V27.0H68.88V11.1H68.82L66.42 27.0H63.66L61.26 11.1H61.2V27.0H58.32Z M74.46 6.0H83.19V9.0H77.76V14.85H82.02V17.85H77.76V27.0H74.46Z M84.78 6.0H88.08V24.0H93.51V27.0H84.78Z M95.1 6.0H98.4V27.0H95.1Z M103.77 16.26 100.14 6.0H103.62L105.84 12.78H105.9L108.18 6.0H111.3L107.67 16.26L111.48 27.0H108.0L105.6 19.68H105.54L103.08 27.0H99.96Z" />
	</svg>
);

// ─── Episode data ─────────────────────────────────────────────────────────────

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBtn({
	label,
	children,
	active,
}: {
	label: string;
	children: React.ReactNode;
	active?: boolean;
}) {
	const [hov, setHov] = useState(false);
	return (
		<button
			aria-label={label}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			className="flex items-center justify-center transition-colors"
			style={{
				color: hov || active ? "var(--color-wine)" : "var(--color-cream)",
			}}
		>
			{children}
		</button>
	);
}

function PlayCircle() {
	return (
		<svg width="72" height="72" viewBox="0 0 72 72" fill="none">
			<circle cx="36" cy="36" r="36" fill="rgba(10,9,8,0.65)" />
			<polygon points="28,20 56,36 28,52" fill="var(--color-cream)" />
		</svg>
	);
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
	return playing ? (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<rect x="6" y="4" width="4" height="16" rx="1" />
			<rect x="14" y="4" width="4" height="16" rx="1" />
		</svg>
	) : (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<polygon points="5,3 19,12 5,21" />
		</svg>
	);
}

function Skip10Icon({ forward }: { forward?: boolean }) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ transform: forward ? "none" : "scaleX(-1)" }}
		>
			<polyline points="15 14 20 9 15 4" />
			<path d="M4 20v-7a4 4 0 0 1 4-4h12" />
			<text
				x="6"
				y="22"
				fontSize="6"
				fill="currentColor"
				stroke="none"
				fontFamily="sans-serif"
				fontWeight="bold"
			>
				10
			</text>
		</svg>
	);
}

function VolumeIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
		</svg>
	);
}

function CcIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="6" width="20" height="12" rx="2" />
			<path d="M8 12H6a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1h2" />
			<path d="M15 12h-2a1 1 0 0 0-1 1v0a1 1 0 0 0 1 1h2" />
		</svg>
	);
}

function SettingsIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	);
}

function FullscreenIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="15 3 21 3 21 9" />
			<polyline points="9 21 3 21 3 15" />
			<line x1="21" y1="3" x2="14" y2="10" />
			<line x1="3" y1="21" x2="10" y2="14" />
		</svg>
	);
}

function BackIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	);
}

function LoopIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="17 1 21 5 17 9" />
			<path d="M3 11V9a4 4 0 0 1 4-4h14" />
			<polyline points="7 23 3 19 7 15" />
			<path d="M21 13v2a4 4 0 0 1-4 4H3" />
		</svg>
	);
}

function ShuffleIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="16 3 21 3 21 8" />
			<line x1="4" y1="20" x2="21" y2="3" />
			<polyline points="21 16 21 21 16 21" />
			<line x1="15" y1="15" x2="21" y2="21" />
			<line x1="4" y1="4" x2="9" y2="9" />
		</svg>
	);
}

// ─── Scrubber ─────────────────────────────────────────────────────────────────

function Scrubber({
	progress,
	onChange,
}: {
	progress: number;
	onChange: (v: number) => void;
}) {
	return (
		<div
			className="relative w-full h-4 flex items-center cursor-pointer group"
			onClick={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				onChange(
					Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
				);
			}}
		>
			{/* Track */}
			<div
				className={`w-full h-1 rounded-full relative ${styles.scrubberTrack}`}
			>
				{/* Fill */}
				<div
					className={`h-full rounded-full ${styles.scrubberFill}`}
					style={{ width: `${progress * 100}%` }}
				/>
				{/* Handle */}
				<div
					className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${styles.scrubberHandle}`}
					style={{ left: `calc(${progress * 100}% - 6px)` }}
				/>
			</div>
		</div>
	);
}

// ─── Player area ─────────────────────────────────────────────────────────────

function PlayerArea({
	title,
	year,
	rating,
	match,
	backgroundImage,
}: {
	title: string;
	year: string;
	rating: string;
	match: number;
	backgroundImage: string;
}) {
	const [playing, setPlaying] = useState(false);
	const [progress, setProgress] = useState(0.28);
	const [subscribed, setSubscribed] = useState(false);

	const elapsed = Math.round(progress * 142);
	const fmt = (s: number) =>
		`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

	return (
		<div className="flex flex-col">
			{/* 16:9 video frame */}
			<div className="relative w-full" style={{ aspectRatio: "16/9" }}>
				<img
					src={backgroundImage}
					alt={title}
					className="w-full h-full object-cover rounded-xl"
				/>
				{/* Bottom gradient */}
				<div
					className={`absolute inset-0 rounded-xl ${styles.videoGradient}`}
				/>

				{/* Center play circle */}
				<button
					onClick={() => setPlaying((p) => !p)}
					className="absolute inset-0 flex items-center justify-center"
					aria-label={playing ? "Pause" : "Play"}
				>
					<PlayCircle />
				</button>

				{/* Controls overlay */}
				<div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex flex-col gap-2">
					<Scrubber progress={progress} onChange={setProgress} />
					<div className="flex items-center gap-4">
						<IconBtn label={playing ? "Pause" : "Play"} active={false}>
							<span onClick={() => setPlaying((p) => !p)}>
								<PlayPauseIcon playing={playing} />
							</span>
						</IconBtn>
						<IconBtn label="Skip back 10s">
							<Skip10Icon />
						</IconBtn>
						<IconBtn label="Skip forward 10s">
							<Skip10Icon forward />
						</IconBtn>
						<span className={`text-xs ml-1 ${styles.timeText}`}>
							{fmt(elapsed)} / 2:22
						</span>
						<div className="flex-1" />
						<IconBtn label="Volume">
							<VolumeIcon />
						</IconBtn>
						<IconBtn label="Subtitles">
							<CcIcon />
						</IconBtn>
						<IconBtn label="Settings">
							<SettingsIcon />
						</IconBtn>
						<IconBtn label="Fullscreen">
							<FullscreenIcon />
						</IconBtn>
					</div>
				</div>
			</div>

			{/* Below player */}
			<div className="mt-5 flex items-start justify-between gap-4">
				<div>
					<h2
						className={`text-3xl uppercase leading-none mb-2 ${styles.playerTitle}`}
					>
						{title}
					</h2>
					<div className="flex items-center gap-3">
						<span className={`text-sm font-bold ${styles.matchText}`}>
							{match}% Match
						</span>
						<span className={`text-sm ${styles.metaText}`}>{year}</span>
						<span
							className={`text-xs px-1.5 py-0.5 border rounded ${styles.badge}`}
						>
							{rating}
						</span>
					</div>
				</div>
				<button
					onClick={() => setSubscribed((s) => !s)}
					className={`shrink-0 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-150 ${subscribed ? styles.subscribeBtnActive : styles.subscribeBtnInactive}`}
				>
					{subscribed ? "✓ Following" : "+ Subscribe"}
				</button>
			</div>
		</div>
	);
}

// ─── Episode Panel ────────────────────────────────────────────────────────────

function EpisodePanel({
	showTitle,
	episodes,
}: {
	showTitle: string;
	episodes: TMDBEpisode[];
}) {
	const [activeEp, setActiveEp] = useState(1);

	return (
		<div
			className={`flex flex-col h-full rounded-xl overflow-hidden ${styles.episodePanel}`}
		>
			{/* Panel header */}
			<div className={`px-4 pt-4 pb-3 ${styles.episodePanelHeader}`}>
				<h3
					className={`text-base font-bold leading-tight mb-0.5 ${styles.episodePanelTitle}`}
				>
					{showTitle}
				</h3>
				<p className={`text-xs ${styles.episodePanelSubtitle}`}>
					Season 1 · Episode list
				</p>
				{/* Utility row */}
				<div
					className={`flex items-center gap-3 mt-3 ${styles.episodePanelUtility}`}
				>
					<button
						className="hover:text-[var(--color-cream)] transition-colors"
						aria-label="Loop"
					>
						<LoopIcon />
					</button>
					<button
						className="hover:text-[var(--color-cream)] transition-colors"
						aria-label="Shuffle"
					>
						<ShuffleIcon />
					</button>
					<button
						className="ml-auto text-sm hover:text-[var(--color-cream)] transition-colors"
						aria-label="More"
					>
						···
					</button>
				</div>
			</div>

			{/* Episode list */}
			<div
				className="flex-1 overflow-y-auto"
				style={{ scrollbarWidth: "none" }}
			>
				{episodes.length === 0 && (
					<p className={`px-4 py-6 text-xs ${styles.episodeSubLabel}`}>
						Episode details are unavailable from TMDB.
					</p>
				)}
				{episodes.map((ep) => {
					const active = activeEp === ep.ep;
					return (
						<button
							key={ep.ep}
							onClick={() => setActiveEp(ep.ep)}
							className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${styles.episodeRow} ${active ? styles.episodeRowActive : styles.episodeRowInactive}`}
						>
							<span
								className={`text-xs w-4 shrink-0 text-right ${styles.episodeNum}`}
							>
								{ep.ep}
							</span>
							<div
								className="relative shrink-0 rounded overflow-hidden"
								style={{ width: 80, aspectRatio: "16/9" }}
							>
								{ep.thumb && (
									<img
										src={ep.thumb}
										alt={ep.title}
										className="w-full h-full object-cover"
									/>
								)}
								<div
									className={`absolute bottom-1 right-1 px-1 rounded text-[9px] ${styles.episodeDurationBadge} ${active ? styles.episodeDurationActive : styles.episodeDurationInactive}`}
								>
									{active ? "▶ Now" : ep.duration}
								</div>
							</div>
							<div className="flex flex-col min-w-0">
								<span
									className={`text-xs font-semibold leading-tight truncate ${active ? styles.episodeTitleActive : styles.episodeTitleInactive}`}
								>
									{ep.title}
								</span>
								<span
									className={`text-[10px] mt-0.5 ${styles.episodeSubLabel}`}
								>
									S1 · E{ep.ep}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

// ─── Reactions & Comments ────────────────────────────────────────────────────

const REACTIONS = [
	{ emoji: "👍", label: "Upvote", count: 0 },
	{ emoji: "😂", label: "Funny", count: 0 },
	{ emoji: "❤️", label: "Love", count: 0 },
	{ emoji: "😮", label: "Surprised", count: 0 },
	{ emoji: "😠", label: "Angry", count: 0 },
	{ emoji: "😢", label: "Sad", count: 0 },
];

interface CommentData {
	id: number;
	avatar: string;
	avatarColor: string;
	user: string;
	time: string;
	text: string;
	reactions: { emoji: string; count: number }[];
	replies: CommentData[];
}

const COMMENTS: CommentData[] = [];

function ReactionMini({ emoji, count }: { emoji: string; count: number }) {
	const [active, setActive] = useState(false);
	return (
		<button
			onClick={() => setActive((a) => !a)}
			className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${active ? styles.reactionMiniActive : styles.reactionMiniInactive}`}
		>
			<span>{emoji}</span>
			<span>{active ? count + 1 : count}</span>
		</button>
	);
}

function CommentRow({
	comment,
	nested = false,
}: {
	comment: CommentData;
	nested?: boolean;
}) {
	return (
		<div
			className={`flex gap-3 ${nested ? `pl-10 ${styles.commentThread}` : ""}`}
		>
			{/* Avatar */}
			<div
				className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${styles.avatarBubble}`}
				style={{ background: comment.avatarColor || "var(--color-stone)" }}
			>
				{comment.avatar}
			</div>
			<div className="flex-1 min-w-0">
				{/* Header */}
				<div className="flex items-center gap-2 mb-1">
					<span className={`text-xs font-semibold ${styles.commentUser}`}>
						{comment.user}
					</span>
					<span className={`text-[10px] ${styles.commentTime}`}>
						{comment.time}
					</span>
				</div>
				{/* Text */}
				<p className={`text-sm leading-relaxed mb-2 ${styles.commentText}`}>
					{comment.text}
				</p>
				{/* Actions */}
				<div className="flex items-center gap-2 flex-wrap">
					{comment.reactions.map((r) => (
						<ReactionMini key={r.emoji} emoji={r.emoji} count={r.count} />
					))}
					<button
						className={`text-xs transition-colors hover:text-[var(--color-wine)] ml-1 ${styles.replyBtn}`}
					>
						Reply
					</button>
				</div>
			</div>
		</div>
	);
}

function ReactionButton({
	emoji,
	label,
	count,
}: {
	emoji: string;
	label: string;
	count: number;
}) {
	const [active, setActive] = useState(false);
	return (
		<button
			onClick={() => setActive((a) => !a)}
			className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
		>
			<span className="text-2xl">{emoji}</span>
			<span
				className={`text-xs font-bold ${active ? styles.reactionCountActive : styles.reactionCountInactive}`}
			>
				{active ? count + 1 : count}
			</span>
			<span className={`text-[10px] ${styles.reactionLabel}`}>{label}</span>
		</button>
	);
}

function ReactionsAndComments({
	contentType,
}: {
	contentType: "movie" | "series";
}) {
	const [sort, setSort] = useState<"Best" | "Newest" | "Oldest">("Best");
	const [rulesDismissed, setRulesDismissed] = useState(false);

	return (
		<div className={`mt-10 ${styles.sectionDivider}`}>
			{/* ── Reactions ── */}
			<div className="flex flex-col items-center gap-3 mb-10">
				<p className={`text-sm font-semibold ${styles.reactionHeading}`}>
					What did you think of this{" "}
					{contentType === "series" ? "episode" : "movie"}?
				</p>
				<p className={`text-xs ${styles.reactionSubtext}`}>
					No reactions yet
				</p>
				<div className="flex items-center gap-10 mt-1">
					{REACTIONS.map((r) => (
						<ReactionButton key={r.label} {...r} />
					))}
				</div>
			</div>

			{/* ── Comments header ── */}
			<div className="flex items-center justify-between mb-4">
				<h3 className={`text-sm font-semibold ${styles.commentsHeading}`}>
					{COMMENTS.length} Comments
				</h3>
				<div className="flex items-center gap-1">
					{(["Best", "Newest", "Oldest"] as const).map((tab) => (
						<button
							key={tab}
							onClick={() => setSort(tab)}
							className={`px-3 py-1 rounded-full text-xs transition-colors ${sort === tab ? styles.sortTabActive : styles.sortTabInactive}`}
						>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* ── Composer (logged-out) ── */}
			<div
				className={`rounded-lg mb-3 overflow-hidden ${styles.composerBox}`}
			>
				<div className="px-4 pt-3 pb-2">
					<p className={`text-sm ${styles.composerText}`}>
						Sign up to join the discussion…
					</p>
				</div>
				<div
					className={`flex items-center justify-between px-4 py-2.5 ${styles.composerFooter}`}
				>
					<div className="flex items-center gap-3">
						{["B", "I", "⊘"].map((icon) => (
							<button
								key={icon}
								className={`text-xs font-bold opacity-40 cursor-not-allowed ${styles.composerIcon}`}
							>
								{icon}
							</button>
						))}
					</div>
					<button
						className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors hover:bg-[var(--color-wine-hover)] ${styles.composerSubmit}`}
					>
						<span>+</span> Sign Up to Comment
					</button>
				</div>
			</div>

			{/* ── Rules notice ── */}
			{!rulesDismissed && (
				<div
					className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-6 ${styles.rulesNotice}`}
				>
					<p className={`flex-1 text-xs ${styles.rulesText}`}>
						By commenting, you agree to follow our comment rules.
					</p>
					<button
						className={`shrink-0 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide transition-colors hover:bg-[var(--color-wine-hover)] ${styles.rulesReadBtn}`}
					>
						Read Rules
					</button>
					<button
						onClick={() => setRulesDismissed(true)}
						className={`shrink-0 text-sm transition-colors hover:text-[var(--color-cream)] ${styles.rulesDismissBtn}`}
						aria-label="Dismiss"
					>
						×
					</button>
				</div>
			)}

			{/* ── Comment thread ── */}
			<div className="flex flex-col gap-6">
				{COMMENTS.map((comment) => (
					<div key={comment.id} className="flex flex-col gap-4">
						<CommentRow comment={comment} />
						{comment.replies.map((reply) => (
							<CommentRow key={reply.id} comment={reply} nested />
						))}
					</div>
				))}
			</div>
		</div>
	);
}

// ─── Watch Screen ─────────────────────────────────────────────────────────────

export interface WatchProps {
	id: number;
	title: string;
	year: string;
	rating: string;
	match: number;
	backgroundImage: string;
	isSeries?: boolean;
	onBack: () => void;
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

	useEffect(() => {
		let cancelled = false;
		if (!isSeries) return;
		fetchTVEpisodes(id).then((items) => {
			if (!cancelled) setEpisodes(items);
		});
		return () => {
			cancelled = true;
		};
	}, [id, isSeries]);

	return (
		<div className={`min-h-screen ${styles.page}`}>
			{/* Slim top bar */}
			<header
				className={`flex items-center gap-4 px-10 xl:px-12 h-14 sticky top-0 z-50 ${styles.topBar}`}
			>
				<button
					onClick={onBack}
					className={`flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--color-cream)] ${styles.backBtn}`}
					aria-label="Back to dashboard"
				>
					<BackIcon />
					Back
				</button>
				<div className="flex-1 flex justify-center">{LOGO_SVG}</div>
				<div style={{ width: 64 }} />
			</header>

			{/* Variant label */}
			<div className="px-10 xl:px-12 pt-6 pb-1">
				<p
					className={`text-[10px] uppercase tracking-[0.2em] ${styles.variantLabel}`}
				>
					{isSeries
						? "Series variant — video + episode panel"
						: "Movie variant — full-width, no side panel"}
				</p>
			</div>

			{/* Content */}
			<div
				className={`px-10 xl:px-12 py-4 ${isSeries ? "flex gap-5 items-start" : ""}`}
			>
				{/* Player */}
				<div className={isSeries ? "w-[70%] shrink-0" : "w-full"}>
					<PlayerArea
						title={title}
						year={year}
						rating={rating}
						match={match}
						backgroundImage={backgroundImage}
					/>
					<ReactionsAndComments
						contentType={isSeries ? "series" : "movie"}
					/>
				</div>

				{/* Episode panel (series only) */}
				{isSeries && (
					<div
						className="flex-1"
						style={{ height: "calc(56.25vw * 0.7 + 88px)" }}
					>
						<EpisodePanel showTitle={title} episodes={episodes} />
					</div>
				)}
			</div>

			{/* Dev handoff note */}
			<div
				className={`mx-10 xl:mx-12 my-8 px-5 py-3 rounded-lg text-xs italic ${styles.devNote}`}
			>
				Dev note: Clicking a title opens this Watch screen. If the content
				is a single movie, use the Movie variant (full-width, no side
				panel). If it is a series, use the Series variant with the episode
				panel, current episode highlighted.
			</div>
		</div>
	);
}
