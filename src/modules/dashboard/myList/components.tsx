import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./myList.module.css";
import { fetchShowDetails } from "../../movie/tmdb";
import { addToMyList, getMyList, removeFromMyList } from "./myListStore";

// ── Types ────────────────────────────────────────────────────────────────────

type ContentType = "Movie" | "Series";
type SortOption =
	| "Recently Added"
	| "Title A–Z"
	| "Title Z–A"
	| "Release Year: Newest"
	| "Release Year: Oldest";

interface Title {
	id: number;
	title: string;
	type: ContentType;
	year: number;
	rating: string;
	runtime?: string;
	addedAt: number;
	gradient?: string;
	image?: string;
	mediaType?: "movie" | "tv";
}

// ── Sample data ──────────────────────────────────────────────────────────────

const INITIAL_TITLES: Title[] = [
	{
		id: 1,
		title: "The Last Horizon",
		type: "Movie",
		year: 2024,
		rating: "PG-13",
		runtime: "2h 14m",
		addedAt: 8,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 2,
		title: "Midnight Archive",
		type: "Series",
		year: 2023,
		rating: "TV-MA",
		runtime: "S2 · 10 ep",
		addedAt: 7,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 3,
		title: "Echoes of Tomorrow",
		type: "Series",
		year: 2024,
		rating: "TV-14",
		runtime: "S1 · 8 ep",
		addedAt: 6,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 4,
		title: "Crimson Harbor",
		type: "Movie",
		year: 2023,
		rating: "PG-13",
		runtime: "1h 58m",
		addedAt: 5,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 5,
		title: "Silent Current",
		type: "Series",
		year: 2024,
		rating: "TV-14",
		runtime: "S3 · 6 ep",
		addedAt: 4,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 6,
		title: "Glass Kingdom",
		type: "Movie",
		year: 2022,
		rating: "PG",
		runtime: "1h 45m",
		addedAt: 3,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 7,
		title: "After the Signal",
		type: "Series",
		year: 2023,
		rating: "TV-PG",
		runtime: "S2 · 12 ep",
		addedAt: 2,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
	{
		id: 8,
		title: "Northbound",
		type: "Movie",
		year: 2024,
		rating: "PG-13",
		runtime: "2h 02m",
		addedAt: 1,
		gradient: "linear-gradient(135deg,var(--color-ink-soft) 0%,var(--color-ink-soft) 60%,var(--color-ink) 100%)",
	},
];

// ── Icons ────────────────────────────────────────────────────────────────────

const PlayIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
		<polygon points="5,3 19,12 5,21" />
	</svg>
);
const InfoIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		width="14"
		height="14"
	>
		<circle cx="12" cy="12" r="10" />
		<line
			x1="12"
			y1="8"
			x2="12"
			y2="8"
			strokeWidth="3"
			strokeLinecap="round"
		/>
		<line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
	</svg>
);
const CheckIcon = ({ size = 12 }: { size?: number }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="3"
		width={size}
		height={size}
	>
		<polyline points="20,6 9,17 4,12" />
	</svg>
);
const SearchIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		width="18"
		height="18"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);
const BellIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		width="18"
		height="18"
	>
		<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
);
const ChevronDown = ({ size = 14 }: { size?: number }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		width={size}
		height={size}
	>
		<polyline points="6,9 12,15 18,9" />
	</svg>
);
const CloseIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		width="16"
		height="16"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);
const BookmarkIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		width="36"
		height="36"
	>
		<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
	</svg>
);
const XIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		width="12"
		height="12"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

// ── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({
	item,
	onRemove,
	onPlay,
	onInfo,
}: {
	item: Title;
	onRemove: (id: number) => void;
	onPlay: (item: Title) => void;
	onInfo: (item: Title) => void;
}) {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const show = hovered || focused;

	return (
		<div
			className={styles.cardWrap}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			tabIndex={0}
			role="group"
			aria-label={item.title}
		>
			{/* Thumbnail */}
			<div
				style={{
					aspectRatio: "16/9",
					background: item.gradient ?? "var(--color-ink-soft)",
					borderRadius: 4,
					border: show ? "2px solid var(--color-wine)" : "2px solid transparent",
					overflow: "hidden",
					position: "relative",
					transition: "border-color 0.2s",
				}}
			>
				{item.image && <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
				{/* Cinematic title overlay on thumbnail */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "flex-end",
						padding: "10px 12px",
						background:
							"linear-gradient(to top, rgba(10,9,8,0.9) 0%, transparent 60%)",
					}}
				>
					<span
						className={styles.display}
						style={{
							color: "var(--color-cream)",
							fontSize: "clamp(0.7rem, 1.1vw, 1rem)",
							fontWeight: 700,
							letterSpacing: "0.04em",
							textTransform: "uppercase",
							lineHeight: 1.1,
							textShadow: "0 1px 4px rgba(0,0,0,0.8)",
						}}
					>
						{item.title}
					</span>
				</div>

				{/* Saved checkmark */}
				<div style={{ position: "absolute", top: 8, right: 8 }}>
					<div
						title="Remove from My List"
						onClick={() => onRemove(item.id)}
						role="button"
						tabIndex={0}
						aria-label={`Remove ${item.title} from My List`}
						onKeyDown={(e) => e.key === "Enter" && onRemove(item.id)}
						style={{
							width: 22,
							height: 22,
							background: "var(--color-wine)",
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							border: "1.5px solid rgba(242,244,243,0.3)",
						}}
					>
						<CheckIcon size={11} />
					</div>
				</div>

				{/* Hover overlay with controls */}
				{show && (
					<div
						style={{
							position: "absolute",
							inset: 0,
							background: "rgba(10,9,8,0.55)",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							gap: 10,
						}}
					>
						<div
							style={{ display: "flex", gap: 10, alignItems: "center" }}
						>
							{/* Play */}
							<Tooltip label="Play">
								<button
									onClick={() => onPlay(item)}
									aria-label={`Play ${item.title}`}
									style={{
										width: 38,
										height: 38,
										borderRadius: "50%",
										background: "var(--color-wine)",
										border: "none",
										color: "var(--color-cream)",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
									className="hover:brightness-125 transition-all"
								>
									<PlayIcon />
								</button>
							</Tooltip>

							{/* More Info */}
							<Tooltip label="More Info">
								<button
									onClick={() => onInfo(item)}
									aria-label={`More information about ${item.title}`}
									style={{
										width: 34,
										height: 34,
										borderRadius: "50%",
										background: "none",
										border: "2px solid rgba(242,244,243,0.7)",
										color: "var(--color-cream)",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
									className="hover:border-[var(--color-cream)] hover:bg-white/10 transition-all"
								>
									<InfoIcon />
								</button>
							</Tooltip>

							{/* Remove */}
							<Tooltip label="Remove from My List">
								<button
									onClick={() => onRemove(item.id)}
									aria-label={`Remove ${item.title} from My List`}
									style={{
										width: 34,
										height: 34,
										borderRadius: "50%",
										background: "none",
										border: "2px solid rgba(242,244,243,0.5)",
										color: "var(--color-taupe)",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
									className="hover:border-[var(--color-taupe)] hover:bg-white/10 transition-all"
								>
									<XIcon />
								</button>
							</Tooltip>
						</div>
					</div>
				)}
			</div>

			{/* Card meta */}
			<div style={{ padding: "8px 2px 4px" }}>
				<p
					style={{
						color: "var(--color-cream)",
						fontWeight: 600,
						fontSize: "0.82rem",
						marginBottom: 3,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{item.title}
				</p>
				<p
					style={{
						color: "var(--color-taupe)",
						fontSize: "0.75rem",
						display: "flex",
						gap: 6,
						flexWrap: "wrap",
					}}
				>
					<span>{item.year}</span>
					<span style={{ color: "var(--color-stone)" }}>·</span>
					<span
						style={{
							border: "1px solid var(--color-stone)",
							borderRadius: 2,
							padding: "0 3px",
							fontSize: "0.68rem",
							lineHeight: "1.5",
						}}
					>
						{item.rating}
					</span>
					{item.runtime && (
						<>
							<span style={{ color: "var(--color-stone)" }}>·</span>
							<span>{item.runtime}</span>
						</>
					)}
				</p>
			</div>
		</div>
	);
}

// ── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	const [show, setShow] = useState(false);
	return (
		<div
			style={{ position: "relative", display: "inline-flex" }}
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
		>
			{children}
			{show && (
				<div
					style={{
						position: "absolute",
						bottom: "calc(100% + 6px)",
						left: "50%",
						transform: "translateX(-50%)",
						background: "var(--color-ink-soft)",
						border: "1px solid var(--color-stone)",
						color: "var(--color-cream)",
						fontSize: "0.72rem",
						padding: "3px 8px",
						borderRadius: 3,
						whiteSpace: "nowrap",
						pointerEvents: "none",
						zIndex: 100,
					}}
				>
					{label}
				</div>
			)}
		</div>
	);
}

// ── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
	return (
		<div>
			<div
				className={styles.skeleton}
				style={{ aspectRatio: "16/9", borderRadius: 4 }}
			/>
			<div style={{ padding: "8px 2px" }}>
				<div
					className={styles.skeleton}
					style={{
						height: 12,
						borderRadius: 2,
						marginBottom: 6,
						width: "70%",
					}}
				/>
				<div
					className={styles.skeleton}
					style={{ height: 10, borderRadius: 2, width: "50%" }}
				/>
			</div>
		</div>
	);
}

// ── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({ item, onClose }: { item: Title; onClose: () => void }) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		modalRef.current?.focus();
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [onClose]);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={`Details for ${item.title}`}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(10,9,8,0.85)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 200,
				padding: 24,
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				ref={modalRef}
				tabIndex={-1}
				style={{
					background: "var(--color-ink-soft)",
					border: "1px solid var(--color-stone)",
					borderRadius: 6,
					width: "100%",
					maxWidth: 680,
					overflow: "hidden",
					outline: "none",
				}}
			>
				{/* Backdrop */}
				<div
					style={{
						aspectRatio: "16/7",
						background: item.gradient,
						position: "relative",
					}}
				>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(to top, var(--color-ink-soft) 0%, transparent 60%)",
						}}
					/>
					<button
						onClick={onClose}
						aria-label="Close"
						style={{
							position: "absolute",
							top: 12,
							right: 12,
							width: 32,
							height: 32,
							background: "rgba(10,9,8,0.7)",
							border: "1px solid var(--color-stone)",
							borderRadius: "50%",
							color: "var(--color-cream)",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CloseIcon />
					</button>
					<div style={{ position: "absolute", bottom: 24, left: 24 }}>
						<h2
							className={styles.display}
							style={{
								color: "var(--color-cream)",
								fontSize: "2rem",
								fontWeight: 800,
								letterSpacing: "0.04em",
								textTransform: "uppercase",
								margin: 0,
							}}
						>
							{item.title}
						</h2>
					</div>
				</div>

				{/* Details */}
				<div style={{ padding: 24 }}>
					<div
						style={{
							display: "flex",
							gap: 12,
							marginBottom: 16,
							flexWrap: "wrap",
						}}
					>
						<span style={{ color: "var(--color-taupe)", fontSize: "0.85rem" }}>
							{item.year}
						</span>
						<span style={{ color: "var(--color-stone)" }}>·</span>
						<span
							style={{
								color: "var(--color-taupe)",
								fontSize: "0.85rem",
								border: "1px solid var(--color-stone)",
								borderRadius: 2,
								padding: "0 6px",
							}}
						>
							{item.rating}
						</span>
						{item.runtime && (
							<>
								<span style={{ color: "var(--color-stone)" }}>·</span>
								<span style={{ color: "var(--color-taupe)", fontSize: "0.85rem" }}>
									{item.runtime}
								</span>
							</>
						)}
						<span style={{ color: "var(--color-stone)" }}>·</span>
						<span style={{ color: "var(--color-taupe)", fontSize: "0.85rem" }}>
							{item.type}
						</span>
					</div>

					<p
						style={{
							color: "var(--color-taupe)",
							fontSize: "0.875rem",
							lineHeight: 1.6,
							marginBottom: 20,
						}}
					>
						An immersive {item.type === "Movie" ? "film" : "series"}{" "}
						experience that redefines storytelling. Leave API and backend
						configuration blank so you can connect them later.
					</p>

					<div style={{ display: "flex", gap: 10 }}>
						<button
							style={{
								background: "var(--color-wine)",
								color: "var(--color-cream)",
								border: "none",
								borderRadius: 4,
								padding: "10px 22px",
								fontSize: "0.875rem",
								fontWeight: 600,
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
							className="hover:brightness-125 transition-all"
						>
							<PlayIcon /> Play
						</button>
						<button
							onClick={onClose}
							style={{
								background: "none",
								color: "var(--color-cream)",
								border: "1px solid var(--color-stone)",
								borderRadius: 4,
								padding: "10px 22px",
								fontSize: "0.875rem",
								fontWeight: 500,
								cursor: "pointer",
							}}
							className="hover:border-[var(--color-taupe)] transition-all"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Toast ────────────────────────────────────────────────────────────────────

function Toast({
	message,
	action,
	onAction,
	onDismiss,
}: {
	message: string;
	action: string;
	onAction: () => void;
	onDismiss: () => void;
}) {
	useEffect(() => {
		const t = setTimeout(onDismiss, 5000);
		return () => clearTimeout(t);
	}, [onDismiss]);

	return (
		<div
			className={styles.toast}
			role="status"
			aria-live="polite"
			style={{
				position: "fixed",
				bottom: 32,
				left: "50%",
				transform: "translateX(-50%)",
				background: "var(--color-ink-soft)",
				border: "1px solid var(--color-stone)",
				borderRadius: 4,
				padding: "12px 20px",
				display: "flex",
				alignItems: "center",
				gap: 16,
				zIndex: 300,
				whiteSpace: "nowrap",
				boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
			}}
		>
			<span style={{ color: "var(--color-cream)", fontSize: "0.875rem" }}>
				{message}
			</span>
			<button
				onClick={onAction}
				style={{
					color: "var(--color-wine)",
					fontSize: "0.875rem",
					fontWeight: 700,
					background: "none",
					border: "none",
					cursor: "pointer",
					padding: 0,
				}}
				className="hover:brightness-125"
			>
				{action}
			</button>
			<button
				onClick={onDismiss}
				aria-label="Dismiss"
				style={{
					color: "var(--color-taupe)",
					background: "none",
					border: "none",
					cursor: "pointer",
					display: "flex",
					padding: 0,
				}}
			>
				<CloseIcon />
			</button>
		</div>
	);
}

// ── Sorting dropdown ─────────────────────────────────────────────────────────

const SORT_OPTIONS: SortOption[] = [
	"Recently Added",
	"Title A–Z",
	"Title Z–A",
	"Release Year: Newest",
	"Release Year: Oldest",
];

function SortDropdown({
	value,
	onChange,
}: {
	value: SortOption;
	onChange: (v: SortOption) => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", handler);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("keydown", handleKey);
		};
	}, []);

	return (
		<div ref={ref} style={{ position: "relative" }}>
			<button
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-haspopup="listbox"
				style={{
					background: "none",
					border: "1px solid var(--color-stone)",
					borderRadius: 4,
					color: "var(--color-taupe)",
					fontSize: "0.82rem",
					padding: "7px 12px",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: 8,
				}}
				className="hover:border-[var(--color-taupe)] transition-colors"
			>
				<span style={{ color: "var(--color-stone)", fontSize: "0.75rem" }}>Sort:</span>
				{value}
				<ChevronDown />
			</button>

			{open && (
				<div
					className={styles.dropdown}
					style={{
						position: "absolute",
						right: 0,
						top: "calc(100% + 4px)",
						width: 220,
						zIndex: 50,
					}}
					role="listbox"
					aria-label="Sort options"
				>
					{SORT_OPTIONS.map((opt) => (
						<button
							key={opt}
							role="option"
							aria-selected={opt === value}
							onClick={() => {
								onChange(opt);
								setOpen(false);
							}}
							style={{
								display: "block",
								width: "100%",
								textAlign: "left",
								padding: "9px 14px",
								background: "none",
								border: "none",
								fontSize: "0.83rem",
								cursor: "pointer",
								color: opt === value ? "var(--color-cream)" : "var(--color-taupe)",
								fontWeight: opt === value ? 600 : 400,
								borderLeft:
									opt === value
										? "2px solid var(--color-wine)"
										: "2px solid transparent",
							}}
							className="hover:bg-[var(--color-ink-soft)] transition-colors"
						>
							{opt}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// ── Sorting logic ────────────────────────────────────────────────────────────

function sortTitles(titles: Title[], sort: SortOption): Title[] {
	const arr = [...titles];
	switch (sort) {
		case "Recently Added":
			return arr.sort((a, b) => b.addedAt - a.addedAt);
		case "Title A–Z":
			return arr.sort((a, b) => a.title.localeCompare(b.title));
		case "Title Z–A":
			return arr.sort((a, b) => b.title.localeCompare(a.title));
		case "Release Year: Newest":
			return arr.sort((a, b) => b.year - a.year);
		case "Release Year: Oldest":
			return arr.sort((a, b) => a.year - b.year);
		default:
			return arr;
	}
}

// ── Main App ─────────────────────────────────────────────────────────────────

type AppState = "loading" | "loaded" | "error";

export function MyListView({ onBrowse }: { onBrowse: () => void }) {
	const [appState, setAppState] = useState<AppState>("loading");
	const [titles, setTitles] = useState<Title[]>([]);
	const [sortOption, setSortOption] = useState<SortOption>("Recently Added");
	const [toast, setToast] = useState<{ item: Title } | null>(null);
	const [modal, setModal] = useState<Title | null>(null);

	useEffect(() => {
		let active = true;
		const entries = getMyList();
		Promise.all(entries.map(async (entry) => {
			const show = await fetchShowDetails(entry.id, entry.mediaType);
			return show ? { id: show.id, title: show.title, type: entry.mediaType === "tv" ? "Series" as const : "Movie" as const, year: Number(show.year) || 0, rating: show.rating, runtime: show.duration, addedAt: entry.addedAt, image: show.image, mediaType: entry.mediaType } : null;
		})).then((items) => {
			if (!active) return;
			setTitles(items.flatMap((item) => item ? [item] : []));
			setAppState("loaded");
		}).catch(() => active && setAppState("error"));
		return () => { active = false; };
	}, []);

	const sorted = sortTitles(titles, sortOption);

	const handleRemove = useCallback(
		(id: number) => {
			const item = titles.find((t) => t.id === id);
			if (!item) return;
			removeFromMyList(item.id, item.mediaType ?? (item.type === "Series" ? "tv" : "movie"));
			setTitles((prev) => prev.filter((t) => t.id !== id));
			setToast({ item });
			const sr = document.getElementById("sr-announce");
			if (sr) sr.textContent = `Removed ${item.title} from My List.`;
		},
		[titles],
	);

	const handleUndo = useCallback(() => {
		if (!toast) return;
		addToMyList(toast.item.id, toast.item.mediaType ?? (toast.item.type === "Series" ? "tv" : "movie"), toast.item.addedAt);
		setTitles((prev) => {
			const exists = prev.find((t) => t.id === toast.item.id);
			if (exists) return prev;
			return sortTitles([...prev, toast.item], sortOption);
		});
		const sr = document.getElementById("sr-announce");
		if (sr) sr.textContent = `Restored ${toast.item.title} to My List.`;
		setToast(null);
	}, [toast, sortOption]);

	const handlePlay = useCallback((item: Title) => {
		// Player integration point — connect to existing player
		console.info("Play:", item.title);
	}, []);

	return (
		<div className={styles.page}>
			{/* Visually hidden SR announcer */}
			<div
				id="sr-announce"
				aria-live="assertive"
				aria-atomic="true"
				className={styles.srOnly}
			/>

			{/* Page content */}
			<main className={styles.main}>
				<div
					style={{
						maxWidth: 1400,
						margin: "0 auto",
						padding: "48px 48px 80px",
					}}
				>
					{/* ── Loading ── */}
					{appState === "loading" && (
						<>
							<div
								className={styles.skeleton}
								style={{
									height: 52,
									width: 180,
									borderRadius: 4,
									marginBottom: 12,
								}}
							/>
							<div
								className={styles.skeleton}
								style={{
									height: 18,
									width: 320,
									borderRadius: 4,
									marginBottom: 40,
								}}
							/>
							<div className={styles.cardGrid}>
								{Array.from({ length: 8 }).map((_, i) => (
									<SkeletonCard key={i} />
								))}
							</div>
						</>
					)}

					{/* ── Error ── */}
					{appState === "error" && (
						<div style={{ textAlign: "center", paddingTop: 80 }}>
							<h1
								className={styles.display}
								style={{
									color: "var(--color-cream)",
									fontSize: "2rem",
									fontWeight: 700,
									marginBottom: 12,
								}}
							>
								We couldn't load My List.
							</h1>
							<p style={{ color: "var(--color-taupe)", marginBottom: 24 }}>
								Please try again.
							</p>
							<button
								onClick={() => setAppState("loading")}
								style={{
									background: "var(--color-wine)",
									color: "var(--color-cream)",
									border: "none",
									borderRadius: 4,
									padding: "10px 24px",
									cursor: "pointer",
									fontWeight: 600,
								}}
							>
								Try Again
							</button>
						</div>
					)}

					{/* ── Loaded ── */}
					{appState === "loaded" && (
						<>
							{/* Page intro */}
							<div
								style={{
									marginBottom: 32,
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "space-between",
									flexWrap: "wrap",
									gap: 16,
								}}
							>
								<div>
									<h1
										className={styles.display}
										style={{
											color: "var(--color-cream)",
											fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
											fontWeight: 800,
											letterSpacing: "0.04em",
											textTransform: "uppercase",
											margin: "0 0 8px",
											lineHeight: 1,
										}}
									>
										My List
									</h1>
									<p
										style={{
											color: "var(--color-taupe)",
											fontSize: "0.9rem",
											margin: 0,
										}}
									>
										Your saved movies and series, all in one place.
									</p>
								</div>
							</div>

							{/* Sort row */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
									marginBottom: 24,
								}}
							>
								<SortDropdown
									value={sortOption}
									onChange={setSortOption}
								/>
							</div>

							{/* Grid */}
							{sorted.length === 0 ? (
								/* Empty / filtered-empty state */
								<div
									style={{
										textAlign: "center",
										paddingTop: 64,
										paddingBottom: 64,
									}}
								>
									<div style={{ color: "var(--color-taupe)", marginBottom: 20 }}>
										<BookmarkIcon />
									</div>
									<h2
										className={styles.display}
										style={{
											color: "var(--color-cream)",
											fontSize: "1.5rem",
											fontWeight: 700,
											marginBottom: 10,
										}}
									>
										Your list is empty.
									</h2>
									<p
										style={{
											color: "var(--color-taupe)",
											fontSize: "0.875rem",
											marginBottom: 24,
										}}
									>
										Add movies and TV shows to find them here.
									</p>
									<button
										onClick={onBrowse}
										style={{
											background: "var(--color-wine)",
											color: "var(--color-cream)",
											border: "none",
											borderRadius: 4,
											padding: "10px 24px",
											cursor: "pointer",
											fontWeight: 600,
											fontSize: "0.875rem",
										}}
									>
										Browse StreamFlix
									</button>
								</div>
							) : (
								<div
									className={styles.cardGrid}
									role="list"
									aria-label="My List"
								>
									{sorted.map((item) => (
										<div key={item.id} role="listitem">
											<ContentCard
												item={item}
												onRemove={handleRemove}
												onPlay={handlePlay}
												onInfo={setModal}
											/>
										</div>
									))}
								</div>
							)}

							{/* Result count */}
							<p
								aria-live="polite"
								aria-atomic="true"
								style={{
									color: "var(--color-taupe)",
									fontSize: "0.8rem",
									marginTop: 24,
								}}
							>
								{sorted.length}{" "}
								{sorted.length === 1 ? "title" : "titles"} in My List
							</p>
						</>
					)}
				</div>
			</main>

			{/* Toast */}
			{toast && (
				<Toast
					message={`Removed from My List.`}
					action="Undo"
					onAction={handleUndo}
					onDismiss={() => setToast(null)}
				/>
			)}

			{/* Preview modal */}
			{modal && <PreviewModal item={modal} onClose={() => setModal(null)} />}
		</div>
	);
}
