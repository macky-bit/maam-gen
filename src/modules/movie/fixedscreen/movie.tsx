import { useState, useEffect, useRef } from "react";
import batmanImg from "@/imports/download.jpg";

// ─── Palette ──────────────────────────────────────────────────────────────────

const P = {
	ink: "#0A0908",
	wine: "#49111C",
	cream: "#F2F4F3",
	taupe: "#A9927D",
	stone: "#5E503F",
	red: "#E50914",
	surface: "#131210",
	surface2: "#1a1815",
	border: "#2a2520",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ReactionKey = "upvote" | "funny" | "love" | "surprised" | "angry" | "sad";
type SortOrder = "best" | "newest" | "oldest";
type ActivePanel = null | "music" | "refresher";

interface Song {
	id: string;
	title: string;
	artist: string;
	album: string;
	timestamp: string;
}
interface RefresherData {
	summary: string;
	events: string[];
	characters: string[];
	keyDetails: string[];
	hasMajorSpoilers: boolean;
}
interface Episode {
	id: string;
	season: number;
	num: number;
	title: string;
	duration: number;
	description: string;
	music: Song[];
	refresher: RefresherData;
}
interface Comment {
	id: string;
	user: string;
	initials: string;
	avatarColor: string;
	text: string;
	time: string;
	upvotes: number;
	loves: number;
	replies?: Comment[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MOVIE_DURATION = 9120;

const MOVIE_MUSIC: Song[] = [
	{
		id: "m1",
		title: "Why So Serious?",
		artist: "Hans Zimmer & James Newton Howard",
		album: "The Dark Knight OST",
		timestamp: "0:45",
	},
	{
		id: "m2",
		title: "A Dark Knight",
		artist: "Hans Zimmer & James Newton Howard",
		album: "The Dark Knight OST",
		timestamp: "1:23:10",
	},
	{
		id: "m3",
		title: "Harvey Two-Face",
		artist: "Hans Zimmer & James Newton Howard",
		album: "The Dark Knight OST",
		timestamp: "45:22",
	},
	{
		id: "m4",
		title: "Agent of Chaos",
		artist: "Hans Zimmer & James Newton Howard",
		album: "The Dark Knight OST",
		timestamp: "58:47",
	},
	{
		id: "m5",
		title: "Like a Dog Chasing Cars",
		artist: "Hans Zimmer & James Newton Howard",
		album: "The Dark Knight OST",
		timestamp: "1:09:55",
	},
];

const MOVIE_REFRESHER: RefresherData = {
	summary:
		"Batman faces his greatest challenge yet as a psychopathic criminal mastermind known as the Joker plunges Gotham City into anarchy, forcing the Dark Knight to confront moral lines he swore never to cross.",
	events: [
		"The Joker begins targeted attacks on Gotham's mob bosses to seize control of their operations",
		"Harvey Dent, Gotham's DA, is positioned as the city's 'White Knight' to replace the need for Batman",
		"The Joker engineers impossible moral dilemmas — ferries, hospital, hostages — testing humanity itself",
		"Rachel Dawes is killed and Harvey Dent is horribly disfigured, transforming him into Two-Face",
		"Batman takes the fall for Harvey's crimes to preserve hope in Gotham, becoming a fugitive",
	],
	characters: [
		"Bruce Wayne / Batman — Gotham's vigilante hero, tormented by the cost of his no-kill rule",
		"The Joker — anarchic criminal genius who wants to prove everyone breaks under pressure",
		"Harvey Dent / Two-Face — idealistic DA corrupted by grief and disfigurement",
		"Rachel Dawes — Bruce's childhood love, torn between Bruce and Harvey",
		"Commissioner Gordon — Batman's trusted ally inside the GCPD",
	],
	keyDetails: [
		"The Joker's pencil trick was not fully scripted — the cast genuinely reacted to it",
		"Batman's 'no kill' rule is central to the Joker's entire plan against him",
		"The ferry scene is the Joker's ultimate real-world test of human nature",
		"Harvey's coin had two heads until burned on one side — symbolizing his lost idealism",
	],
	hasMajorSpoilers: true,
};

const MOVIE_COMMENTS: Comment[] = [
	{
		id: "c1",
		user: "jk_films",
		initials: "JK",
		avatarColor: P.stone,
		time: "2h ago",
		text: "Absolutely incredible performance. The cinematography in the third act is unmatched — pure cinema.",
		upvotes: 34,
		loves: 12,
		replies: [
			{
				id: "c1r1",
				user: "m_reviews",
				initials: "MR",
				avatarColor: P.wine,
				time: "1h ago",
				text: "Totally agree. The lighting in that scene was something else.",
				upvotes: 8,
				loves: 0,
			},
		],
	},
	{
		id: "c2",
		user: "cinephile99",
		initials: "CP",
		avatarColor: P.taupe,
		time: "5h ago",
		text: "Heath Ledger deserved every award he received. The hospital scene alone carries the whole film.",
		upvotes: 87,
		loves: 45,
	},
	{
		id: "c3",
		user: "darkknightfan",
		initials: "DK",
		avatarColor: P.stone,
		time: "1d ago",
		text: "Watched this for the 12th time. It never gets old. Nolan's masterpiece.",
		upvotes: 122,
		loves: 67,
		replies: [
			{
				id: "c3r1",
				user: "filmcritic_x",
				initials: "FC",
				avatarColor: P.wine,
				time: "22h ago",
				text: "Interstellar gives it a run though...",
				upvotes: 5,
				loves: 2,
			},
		],
	},
	{
		id: "c4",
		user: "gotham_watcher",
		initials: "GW",
		avatarColor: P.wine,
		time: "2d ago",
		text: "The practical effects and real stunts age this film so much better than CGI-heavy blockbusters. Timeless.",
		upvotes: 56,
		loves: 31,
	},
	{
		id: "c5",
		user: "nolan_fan",
		initials: "NF",
		avatarColor: P.taupe,
		time: "3d ago",
		text: "The score alone is worth the watch. Zimmer and Newton Howard created something genuinely haunting.",
		upvotes: 44,
		loves: 18,
	},
	{
		id: "c6",
		user: "dark_cinema",
		initials: "DC",
		avatarColor: P.stone,
		time: "4d ago",
		text: "You feel the weight of every choice Batman makes. That is rare in superhero movies.",
		upvotes: 39,
		loves: 22,
	},
];

const EPISODES: Episode[] = [
	{
		id: "bb-s1e1",
		season: 1,
		num: 1,
		title: "Pilot",
		duration: 3480,
		description:
			"Walter White, a struggling chemistry teacher diagnosed with cancer, teams up with former student Jesse Pinkman to cook methamphetamine.",
		music: [
			{
				id: "e1m1",
				title: "Baby Blue",
				artist: "Badfinger",
				album: "Straight Up",
				timestamp: "57:30",
			},
			{
				id: "e1m2",
				title: "Enchanted",
				artist: "New Mexico Sound",
				album: "Desert Sessions",
				timestamp: "12:44",
			},
		],
		refresher: {
			summary:
				"Walter White receives a terminal cancer diagnosis and, desperate to secure his family's financial future, decides to cook methamphetamine with former student Jesse Pinkman.",
			events: [
				"Walt is diagnosed with inoperable Stage 3A lung cancer",
				"Walt joins his DEA brother-in-law Hank on a drug bust and recognizes Jesse",
				"Walt and Jesse cook their first batch of meth in a mobile RV lab",
				"Walt poisons Emilio with phosphine gas and strangles Krazy-8 to protect himself",
			],
			characters: [
				"Walter White — Chemistry teacher and meth cook",
				"Jesse Pinkman — Walt's former student and drug dealer partner",
				"Skyler White — Walt's pregnant wife",
				"Hank Schrader — Walt's DEA agent brother-in-law",
			],
			keyDetails: [
				"Walt's annual teacher salary is $43,700",
				"The RV becomes their first mobile lab",
				"Walt's decision to cook meth is driven by pride as much as necessity",
			],
			hasMajorSpoilers: false,
		},
	},
	{
		id: "bb-s1e2",
		season: 1,
		num: 2,
		title: "Cat's in the Bag",
		duration: 2880,
		description:
			"Walt and Jesse must deal with the grim aftermath of their first cook and dispose of Emilio's body.",
		music: [
			{
				id: "e2m1",
				title: "Catch Myself Catching Myself",
				artist: "City and Colour",
				album: "Sometimes",
				timestamp: "8:15",
			},
		],
		refresher: {
			summary:
				"Walt and Jesse struggle to dispose of Emilio's dissolved remains while debating who will deal with the still-captive Krazy-8. Skyler grows increasingly suspicious of Walt.",
			events: [
				"The dissolved body melts catastrophically through the floor of Jesse's house",
				"Walt and Jesse argue at length about who will kill Krazy-8",
				"Skyler discovers a discrepancy with Walt's car and begins investigating",
				"Walt learns that Krazy-8 is actually a DEA informant",
			],
			characters: [
				"Walter White",
				"Jesse Pinkman",
				"Skyler White",
				"Krazy-8 — captive drug dealer",
			],
			keyDetails: [
				"Using hydrofluoric acid in a plastic tub rather than a ceramic container was Walt's critical mistake",
				"Walt begins cataloguing every shard from Krazy-8's broken plate",
			],
			hasMajorSpoilers: false,
		},
	},
	{
		id: "bb-s1e3",
		season: 1,
		num: 3,
		title: "...And the Bag's in the River",
		duration: 2880,
		description:
			"Walt forms an unexpected bond with Krazy-8 and almost frees him — until a terrifying discovery changes everything.",
		music: [
			{
				id: "e3m1",
				title: "DLZ",
				artist: "TV on the Radio",
				album: "Dear Science",
				timestamp: "34:20",
			},
		],
		refresher: {
			summary:
				"Walt bonds with Krazy-8 over shared memories and nearly decides to release him — until he realizes Krazy-8 concealed a broken plate shard to use as a weapon.",
			events: [
				"Walt and Krazy-8 bond over their shared connection to a family furniture store",
				"Walt makes a two-column pro/con list on whether to release or kill Krazy-8",
				"Walt discovers the missing plate shard hidden in Krazy-8's hand",
				"Walt strangles Krazy-8 with the bike lock, committing his first intentional murder",
			],
			characters: ["Walter White", "Krazy-8", "Jesse Pinkman"],
			keyDetails: [
				"This is Walt's first deliberate killing — a line he never comes back from",
				"The pro/con list Walt writes shows his conscience fighting his survival instinct",
			],
			hasMajorSpoilers: true,
		},
	},
	{
		id: "bb-s1e4",
		season: 1,
		num: 4,
		title: "Cancer Man",
		duration: 2880,
		description:
			"Walt reveals his cancer diagnosis to his family. Jesse reconnects with his estranged parents.",
		music: [
			{
				id: "e4m1",
				title: "Out of Time Man",
				artist: "Marc Ferrari",
				album: "Soundtrack Library",
				timestamp: "21:05",
			},
		],
		refresher: {
			summary:
				"Walt reveals his diagnosis to Skyler and the wider family, while Jesse attempts to reconnect with his parents and ends up protecting his younger brother.",
			events: [
				"Walt discloses his cancer diagnosis to Skyler and the rest of the family",
				"The family rallies to find funding for Walt's treatment",
				"Jesse visits his parents but is rejected; he discovers his brother Adam has been smoking weed",
				"Jesse takes the blame for the marijuana to protect his younger brother",
			],
			characters: [
				"Walter White",
				"Skyler White",
				"Hank Schrader",
				"Marie Schrader",
				"Jesse Pinkman",
			],
			keyDetails: [
				"Walt's pride prevents him from accepting his former business partners' treatment offer",
				"Jesse protecting his brother is one of the clearest examples of his buried goodness",
			],
			hasMajorSpoilers: false,
		},
	},
	{
		id: "bb-s1e5",
		season: 1,
		num: 5,
		title: "Gray Matter",
		duration: 2880,
		description:
			"Walt runs into his enormously wealthy former business partners at a party and is offered help he refuses.",
		music: [
			{
				id: "e5m1",
				title: "Shimmy Shimmy Ya",
				artist: "Ol' Dirty Bastard",
				album: "Return to the 36 Chambers",
				timestamp: "15:30",
			},
		],
		refresher: {
			summary:
				"Walt attends Elliott Schwartz's birthday party and is offered full funding for his cancer treatment — but refuses out of pride, doubling down on his decision to cook meth instead.",
			events: [
				"Walt and Skyler attend Elliott Schwartz's lavish birthday party",
				"Elliott offers to pay for Walt's entire cancer treatment through his company",
				"Walt refuses and secretly continues planning his meth operation with Jesse",
				"Jesse works on rebuilding his client base independently",
			],
			characters: [
				"Walter White",
				"Skyler White",
				"Elliott Schwartz — Walt's former business partner, now a billionaire",
				"Gretchen Schwartz — Elliott's wife and Walt's ex-girlfriend",
			],
			keyDetails: [
				"Walt sold his share in Gray Matter Technologies for $5,000 — that share is now worth billions",
				"This episode crystallizes Walt's ego and wounded pride as his true fatal flaw",
				"Gretchen and Walt's shared history is left deliberately vague at this stage",
			],
			hasMajorSpoilers: false,
		},
	},
];

const EPISODE_COMMENTS: Record<string, Comment[]> = {
	"bb-s1e1": [
		{
			id: "ec1",
			user: "bb_fan2008",
			initials: "BF",
			avatarColor: P.wine,
			time: "3h ago",
			text: "The scene where Walt watches the money burn is just chilling. Sets up the whole show perfectly.",
			upvotes: 41,
			loves: 22,
		},
		{
			id: "ec2",
			user: "drama_watcher",
			initials: "DW",
			avatarColor: P.stone,
			time: "6h ago",
			text: "Bryan Cranston going from Malcolm in the Middle to THIS. Unreal acting range.",
			upvotes: 88,
			loves: 34,
		},
	],
	"bb-s1e2": [
		{
			id: "ec3",
			user: "gore_warning",
			initials: "GW",
			avatarColor: P.taupe,
			time: "1h ago",
			text: "The bathtub scene destroyed me. Not for the faint of heart but perfectly shot.",
			upvotes: 27,
			loves: 8,
		},
	],
	"bb-s1e3": [
		{
			id: "ec4",
			user: "morality_check",
			initials: "MC",
			avatarColor: P.wine,
			time: "4h ago",
			text: "Walt making that list of reasons not to kill... gut-wrenching. You almost root for him to let the man go.",
			upvotes: 95,
			loves: 51,
		},
	],
	"bb-s1e4": [
		{
			id: "ec5",
			user: "jesse_pov",
			initials: "JP",
			avatarColor: P.stone,
			time: "2h ago",
			text: "Jesse protecting his brother is lowkey one of the most human moments in the whole series.",
			upvotes: 64,
			loves: 29,
		},
	],
	"bb-s1e5": [
		{
			id: "ec6",
			user: "gray_matter_fan",
			initials: "GM",
			avatarColor: P.taupe,
			time: "5h ago",
			text: "Knowing what Walt gave up for $5,000 makes this episode devastating on rewatches.",
			upvotes: 113,
			loves: 72,
		},
	],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(sec: number): string {
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = Math.floor(sec % 60);
	if (h > 0)
		return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}

function fmtDur(sec: number): string {
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	if (h > 0) return `${h}h ${m}m`;
	return `${m}m`;
}

function loadProgress(): Record<string, number> {
	try {
		return JSON.parse(localStorage.getItem("sf_progress") || "{}");
	} catch {
		return {};
	}
}
function saveProgress(p: Record<string, number>) {
	localStorage.setItem("sf_progress", JSON.stringify(p));
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IcoPlay = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill={P.cream}>
		<polygon points="5,3 19,12 5,21" />
	</svg>
);
const IcoPause = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill={P.cream}>
		<rect x="6" y="4" width="4" height="16" />
		<rect x="14" y="4" width="4" height="16" />
	</svg>
);
const IcoChevron = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
	>
		<polyline points="15 18 9 12 15 6" />
	</svg>
);
const IcoVolume = ({ muted }: { muted: boolean }) =>
	muted ? (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke={P.taupe}
			strokeWidth="2"
		>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<line x1="23" y1="9" x2="17" y2="15" />
			<line x1="17" y1="9" x2="23" y2="15" />
		</svg>
	) : (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke={P.taupe}
			strokeWidth="2"
		>
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
			<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
		</svg>
	);

const IcoSettings = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke={P.taupe}
		strokeWidth="2"
	>
		<circle cx="12" cy="12" r="3" />
		<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
	</svg>
);

const IcoFullscreen = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke={P.taupe}
		strokeWidth="2"
	>
		<polyline points="15 3 21 3 21 9" />
		<polyline points="9 21 3 21 3 15" />
		<line x1="21" y1="3" x2="14" y2="10" />
		<line x1="3" y1="21" x2="10" y2="14" />
	</svg>
);

const IcoMusic = ({
	size = 16,
	color = "currentColor",
}: {
	size?: number;
	color?: string;
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
	>
		<path d="M9 18V5l12-2v13" />
		<circle cx="6" cy="18" r="3" />
		<circle cx="18" cy="16" r="3" />
	</svg>
);

const IcoRefresh = ({ size = 16 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<polyline points="23 4 23 10 17 10" />
		<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
	</svg>
);

const IcoClose = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function RefresherSection({
	title,
	items,
}: {
	title: string;
	items: string[];
}) {
	return (
		<div style={{ marginBottom: 20 }}>
			<p
				style={{
					fontSize: 10,
					fontWeight: 700,
					letterSpacing: "0.12em",
					textTransform: "uppercase",
					color: P.taupe,
					marginBottom: 10,
				}}
			>
				{title}
			</p>
			<ul
				style={{
					listStyle: "none",
					margin: 0,
					padding: 0,
					display: "flex",
					flexDirection: "column",
					gap: 8,
				}}
			>
				{items.map((item, i) => (
					<li
						key={i}
						style={{
							display: "flex",
							gap: 10,
							fontSize: 13,
							lineHeight: 1.6,
							color: P.cream,
						}}
					>
						<span style={{ color: P.stone, flexShrink: 0, marginTop: 4 }}>
							▸
						</span>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
}

function CommentCard({
	comment,
	nested = false,
}: {
	comment: Comment;
	nested?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<div style={{ marginLeft: nested ? 44 : 0, marginTop: nested ? 12 : 0 }}>
			<div style={{ display: "flex", gap: 12 }}>
				<div
					style={{
						width: 36,
						height: 36,
						borderRadius: "50%",
						flexShrink: 0,
						backgroundColor: comment.avatarColor,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 12,
						fontWeight: 700,
						color: P.cream,
					}}
				>
					{comment.initials}
				</div>
				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginBottom: 4,
						}}
					>
						<span
							style={{ fontSize: 13, fontWeight: 600, color: P.cream }}
						>
							{comment.user}
						</span>
						<span style={{ fontSize: 12, color: P.stone }}>
							{comment.time}
						</span>
					</div>
					<p
						style={{
							fontSize: 14,
							lineHeight: 1.6,
							color: P.cream,
							margin: 0,
						}}
					>
						{comment.text}
					</p>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 16,
							marginTop: 10,
						}}
					>
						<button
							style={{
								display: "flex",
								alignItems: "center",
								gap: 5,
								fontSize: 13,
								color: P.taupe,
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
							}}
						>
							👍 {comment.upvotes}
						</button>
						{comment.loves > 0 && (
							<button
								style={{
									display: "flex",
									alignItems: "center",
									gap: 5,
									fontSize: 13,
									color: P.taupe,
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: 0,
								}}
							>
								❤️ {comment.loves}
							</button>
						)}
						<button
							style={{
								fontSize: 13,
								color: P.stone,
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
							}}
						>
							Reply
						</button>
						{comment.replies && comment.replies.length > 0 && (
							<button
								onClick={() => setOpen((o) => !o)}
								style={{
									fontSize: 13,
									color: P.taupe,
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: 0,
								}}
							>
								{open
									? "Hide replies"
									: `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
							</button>
						)}
					</div>
					{open &&
						comment.replies?.map((r) => (
							<CommentCard key={r.id} comment={r} nested />
						))}
				</div>
			</div>
		</div>
	);
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
	const [mode, setMode] = useState<"movie" | "series">("movie");
	const [epId, setEpId] = useState("bb-s1e1");

	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(80);
	const [muted, setMuted] = useState(false);
	const [captions, setCaptions] = useState(false);
	const [showCtrl, setShowCtrl] = useState(true);
	const ctrlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [progress, setProgress] =
		useState<Record<string, number>>(loadProgress);
	const [panel, setPanel] = useState<ActivePanel>(null);
	const [spoiler, setSpoiler] = useState(false);
	const [rxn, setRxn] = useState<Record<ReactionKey, number>>({
		upvote: 842,
		funny: 213,
		love: 671,
		surprised: 118,
		angry: 54,
		sad: 97,
	});
	const [myRxn, setMyRxn] = useState<ReactionKey | null>(null);
	const [sort, setSort] = useState<SortOrder>("best");

	const ep = EPISODES.find((e) => e.id === epId) ?? EPISODES[0];
	const cid = mode === "movie" ? "dark-knight" : epId;
	const dur = mode === "movie" ? MOVIE_DURATION : ep.duration;
	const cur = progress[cid] ?? 0;
	const pct = dur > 0 ? Math.min((cur / dur) * 100, 100) : 0;
	const done = pct >= 95;

	useEffect(() => {
		if (!playing) return;
		const id = setInterval(() => {
			setProgress((prev) => {
				const next = {
					...prev,
					[cid]: Math.min((prev[cid] ?? 0) + 1, dur),
				};
				saveProgress(next);
				return next;
			});
		}, 1000);
		return () => clearInterval(id);
	}, [playing, cid, dur]);

	const onMouseMove = () => {
		setShowCtrl(true);
		if (ctrlTimer.current) clearTimeout(ctrlTimer.current);
		if (playing)
			ctrlTimer.current = setTimeout(() => setShowCtrl(false), 3000);
	};

	const seekTo = (s: number) => {
		const t = Math.max(0, Math.min(s, dur));
		setProgress((prev) => {
			const n = { ...prev, [cid]: t };
			saveProgress(n);
			return n;
		});
	};

	const selectEp = (id: string) => {
		setEpId(id);
		setPlaying(false);
		setPanel(null);
		setSpoiler(false);
	};

	const togglePanel = (p: "music" | "refresher") => {
		setPanel((prev) => (prev === p ? null : p));
		setSpoiler(false);
	};

	const react = (k: ReactionKey) => {
		if (myRxn === k) {
			setMyRxn(null);
			setRxn((r) => ({ ...r, [k]: r[k] - 1 }));
		} else {
			if (myRxn) setRxn((r) => ({ ...r, [myRxn]: r[myRxn] - 1 }));
			setMyRxn(k);
			setRxn((r) => ({ ...r, [k]: r[k] + 1 }));
		}
	};

	const music = mode === "movie" ? MOVIE_MUSIC : ep.music;
	const refresher = mode === "movie" ? MOVIE_REFRESHER : ep.refresher;
	const comments =
		mode === "movie" ? MOVIE_COMMENTS : (EPISODE_COMMENTS[epId] ?? []);
	const totalRxn = Object.values(rxn).reduce((a, b) => a + b, 0);
	const title = mode === "movie" ? "The Dark Knight" : "Breaking Bad";
	const year = 2008;
	const rating = mode === "movie" ? "PG-13" : "TV-MA";
	const match = mode === "movie" ? 97 : 99;

	const RXNS: [ReactionKey, string, string][] = [
		["upvote", "👍", "Upvote"],
		["funny", "😂", "Funny"],
		["love", "❤️", "Love"],
		["surprised", "😮", "Surprised"],
		["angry", "😡", "Angry"],
		["sad", "😢", "Sad"],
	];

	// Shared section divider style
	const divider = {
		borderTop: `1px solid ${P.border}`,
		paddingTop: 32,
		marginTop: 32,
	};

	return (
		<div
			style={{ backgroundColor: P.ink, minHeight: "100vh", color: P.cream }}
		>
			{/* ── NAV ── */}
			<nav
				style={{
					position: "sticky",
					top: 0,
					zIndex: 50,
					backgroundColor: P.ink,
					borderBottom: `1px solid ${P.border}`,
				}}
			>
				<div
					style={{
						maxWidth: 1152,
						margin: "0 auto",
						padding: "0 24px",
						height: 56,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						position: "relative",
					}}
				>
					<button
						style={{
							display: "flex",
							alignItems: "center",
							gap: 6,
							fontSize: 14,
							color: P.taupe,
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 0,
						}}
					>
						<IcoChevron /> Back
					</button>

					<span
						style={{
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
							fontSize: 20,
							fontWeight: 900,
							letterSpacing: "0.22em",
							color: P.red,
						}}
					>
						STREAMFLIX
					</span>

					{/* Demo mode switcher */}
					<div style={{ display: "flex", gap: 6 }}>
						{(["movie", "series"] as const).map((m) => (
							<button
								key={m}
								onClick={() => {
									setMode(m);
									setPanel(null);
									setPlaying(false);
								}}
								style={{
									fontSize: 12,
									padding: "4px 12px",
									borderRadius: 4,
									cursor: "pointer",
									textTransform: "capitalize",
									border: `1px solid ${mode === m ? P.wine : P.border}`,
									backgroundColor: mode === m ? P.wine : "transparent",
									color: mode === m ? P.cream : P.taupe,
								}}
							>
								{m}
							</button>
						))}
					</div>
				</div>
			</nav>

			{/* ── MAIN ── */}
			<main
				style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px 80px" }}
			>
				{/* ── PLAYER ── */}
				<div
					style={{
						position: "relative",
						width: "100%",
						aspectRatio: "16/9",
						marginTop: 16,
						borderRadius: 10,
						overflow: "hidden",
						backgroundColor: "#000",
						cursor: showCtrl ? "default" : "none",
					}}
					onMouseMove={onMouseMove}
					onMouseLeave={() => {
						if (playing) setShowCtrl(false);
					}}
					onClick={() => setPlaying((p) => !p)}
				>
					{mode === "movie" ? (
						<img
							src={batmanImg}
							alt="The Dark Knight"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
							}}
						/>
					) : (
						<div
							style={{
								width: "100%",
								height: "100%",
								background:
									"linear-gradient(145deg, #0e0505 0%, #050d05 45%, #05050e 100%)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									textAlign: "center",
									opacity: 0.1,
									userSelect: "none",
								}}
							>
								<div style={{ fontSize: 88 }}>🎬</div>
								<p
									style={{
										fontSize: 11,
										letterSpacing: "0.3em",
										textTransform: "uppercase",
										color: P.cream,
										marginTop: 8,
									}}
								>
									Breaking Bad
								</p>
							</div>
						</div>
					)}

					{/* Gradient */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(to top, rgba(10,9,8,0.96) 0%, rgba(10,9,8,0.2) 40%, transparent 65%)",
							pointerEvents: "none",
						}}
					/>

					{/* Continue badge */}
					{cur > 30 && !playing && (
						<div
							style={{
								position: "absolute",
								top: 12,
								left: 12,
								fontSize: 12,
								padding: "4px 10px",
								borderRadius: 20,
								backgroundColor: "rgba(73,17,28,0.92)",
								border: `1px solid ${P.wine}`,
								color: P.cream,
								backdropFilter: "blur(6px)",
							}}
						>
							{done ? "✓ Watched" : `Continue from ${fmtTime(cur)}`}
						</div>
					)}

					{/* Controls */}
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							opacity: showCtrl ? 1 : 0,
							transition: "opacity 0.25s",
						}}
					>
						{/* Center buttons */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 32,
								pointerEvents: "none",
							}}
						>
							<button
								style={{
									width: 44,
									height: 44,
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 13,
									fontWeight: 700,
									color: P.cream,
									backgroundColor: "rgba(0,0,0,0.6)",
									border: `1px solid rgba(242,244,243,0.2)`,
									cursor: "pointer",
									pointerEvents: "auto",
								}}
								onClick={(e) => {
									e.stopPropagation();
									seekTo(cur - 10);
								}}
							>
								−10
							</button>
							<button
								style={{
									width: 68,
									height: 68,
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "rgba(0,0,0,0.75)",
									border: `2px solid rgba(242,244,243,0.5)`,
									cursor: "pointer",
									pointerEvents: "auto",
								}}
								onClick={(e) => {
									e.stopPropagation();
									setPlaying((p) => !p);
								}}
							>
								{playing ? <IcoPause /> : <IcoPlay />}
							</button>
							<button
								style={{
									width: 44,
									height: 44,
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 13,
									fontWeight: 700,
									color: P.cream,
									backgroundColor: "rgba(0,0,0,0.6)",
									border: `1px solid rgba(242,244,243,0.2)`,
									cursor: "pointer",
									pointerEvents: "auto",
								}}
								onClick={(e) => {
									e.stopPropagation();
									seekTo(cur + 10);
								}}
							>
								+10
							</button>
						</div>

						{/* Bottom bar */}
						<div
							style={{ padding: "0 16px 16px" }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Scrubber */}
							<div
								style={{
									height: 4,
									borderRadius: 2,
									backgroundColor: "rgba(242,244,243,0.2)",
									cursor: "pointer",
									position: "relative",
									marginBottom: 12,
								}}
								onClick={(e) => {
									const rect = e.currentTarget.getBoundingClientRect();
									seekTo(
										Math.floor(
											((e.clientX - rect.left) / rect.width) * dur,
										),
									);
								}}
							>
								<div
									style={{
										height: "100%",
										borderRadius: 2,
										width: `${pct}%`,
										backgroundColor: P.red,
										transition: "width 0.5s linear",
									}}
								/>
								<div
									style={{
										position: "absolute",
										top: "50%",
										transform: "translate(-50%, -50%)",
										width: 14,
										height: 14,
										borderRadius: "50%",
										backgroundColor: P.red,
										left: `${pct}%`,
										boxShadow: "0 0 6px rgba(229,9,20,0.8)",
									}}
								/>
							</div>

							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 16,
									}}
								>
									<button
										onClick={() => setPlaying((p) => !p)}
										style={{
											background: "none",
											border: "none",
											cursor: "pointer",
											padding: 0,
											display: "flex",
										}}
									>
										{playing ? <IcoPause /> : <IcoPlay />}
									</button>
									<span style={{ fontSize: 13, color: P.taupe }}>
										{fmtTime(cur)} / {fmtTime(dur)}
									</span>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 8,
										}}
									>
										<button
											onClick={() => setMuted((m) => !m)}
											style={{
												background: "none",
												border: "none",
												cursor: "pointer",
												padding: 0,
												display: "flex",
											}}
										>
											<IcoVolume muted={muted} />
										</button>
										<input
											type="range"
											min="0"
											max="100"
											value={muted ? 0 : volume}
											onChange={(e) => {
												setVolume(+e.target.value);
												setMuted(false);
											}}
											style={{ width: 70, cursor: "pointer" }}
										/>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 14,
									}}
								>
									<button
										onClick={() => setCaptions((c) => !c)}
										style={{
											fontSize: 11,
											fontWeight: 700,
											padding: "2px 6px",
											borderRadius: 3,
											cursor: "pointer",
											border: `1px solid ${captions ? P.red : "rgba(169,146,125,0.5)"}`,
											color: captions ? P.red : P.taupe,
											background: "none",
										}}
									>
										CC
									</button>
									<button
										style={{
											background: "none",
											border: "none",
											cursor: "pointer",
											padding: 0,
											display: "flex",
										}}
									>
										<IcoSettings />
									</button>
									<button
										style={{
											background: "none",
											border: "none",
											cursor: "pointer",
											padding: 0,
											display: "flex",
										}}
									>
										<IcoFullscreen />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ── CONTENT INFO ── */}
				<div
					style={{
						marginTop: 20,
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						gap: 16,
					}}
				>
					<div>
						<h1
							style={{
								fontSize: 32,
								fontWeight: 900,
								letterSpacing: "-0.02em",
								color: P.cream,
								margin: 0,
								lineHeight: 1.1,
							}}
						>
							{title}
						</h1>
						{mode === "series" && (
							<p
								style={{
									fontSize: 14,
									color: P.taupe,
									margin: "6px 0 0",
								}}
							>
								Season {ep.season} · Episode {ep.num} · {ep.title} ·{" "}
								{fmtDur(ep.duration)}
							</p>
						)}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginTop: 8,
								flexWrap: "wrap",
							}}
						>
							<span
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: "#46d369",
								}}
							>
								{match}% Match
							</span>
							<span style={{ fontSize: 14, color: P.stone }}>
								{year}
							</span>
							<span
								style={{
									fontSize: 12,
									padding: "2px 8px",
									border: `1px solid ${P.stone}`,
									borderRadius: 3,
									color: P.taupe,
								}}
							>
								{rating}
							</span>
						</div>
					</div>
				</div>

				{/* Movie progress bar */}
				{mode === "movie" && cur > 5 && (
					<div style={{ marginTop: 14 }}>
						<div
							style={{
								height: 3,
								borderRadius: 2,
								backgroundColor: P.border,
							}}
						>
							<div
								style={{
									height: "100%",
									borderRadius: 2,
									width: `${pct}%`,
									backgroundColor: done ? P.taupe : P.red,
									transition: "width 0.5s linear",
								}}
							/>
						</div>
						<p style={{ fontSize: 12, color: P.stone, marginTop: 5 }}>
							{done
								? `✓ Watched · ${fmtDur(dur)}`
								: `${Math.round(pct)}% watched · ${fmtTime(dur - cur)} remaining`}
						</p>
					</div>
				)}

				{/* ── ACTION BUTTONS ── */}
				<div
					style={{
						display: "flex",
						gap: 10,
						marginTop: 18,
						flexWrap: "wrap",
					}}
				>
					{(["music", "refresher"] as const).map((p) => (
						<button
							key={p}
							onClick={() => togglePanel(p)}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								padding: "9px 16px",
								borderRadius: 4,
								cursor: "pointer",
								fontSize: 13,
								fontWeight: 500,
								backgroundColor: panel === p ? P.wine : "transparent",
								border: `1px solid ${panel === p ? P.wine : P.stone}`,
								color: panel === p ? P.cream : P.taupe,
								transition: "all 0.15s",
							}}
						>
							{p === "music" ? (
								<>
									<IcoMusic color="currentColor" /> Music
								</>
							) : (
								<>
									<IcoRefresh />{" "}
									{mode === "movie"
										? "Movie Refresher"
										: "Episode Refresher"}
								</>
							)}
						</button>
					))}
				</div>

				{/* ── MUSIC PANEL ── */}
				{panel === "music" && (
					<div
						style={{
							marginTop: 12,
							borderRadius: 10,
							padding: 20,
							backgroundColor: P.surface,
							border: `1px solid ${P.stone}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: 16,
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								<IcoMusic size={15} color={P.taupe} />
								<span
									style={{
										fontSize: 14,
										fontWeight: 600,
										color: P.cream,
									}}
								>
									{mode === "movie"
										? "Soundtrack — The Dark Knight"
										: `Episode Soundtrack — ${ep.title}`}
								</span>
							</div>
							<button
								onClick={() => setPanel(null)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: P.taupe,
									display: "flex",
									padding: 0,
								}}
							>
								<IcoClose />
							</button>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 8,
							}}
						>
							{music.map((s) => (
								<div
									key={s.id}
									style={{
										display: "flex",
										alignItems: "center",
										gap: 12,
										padding: "12px 14px",
										borderRadius: 8,
										backgroundColor: P.surface2,
										border: `1px solid ${P.border}`,
									}}
								>
									<div
										style={{
											width: 42,
											height: 42,
											borderRadius: 6,
											flexShrink: 0,
											backgroundColor: P.wine,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<IcoMusic size={18} color={P.cream} />
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<p
											style={{
												fontSize: 14,
												fontWeight: 500,
												color: P.cream,
												margin: 0,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{s.title}
										</p>
										<p
											style={{
												fontSize: 12,
												color: P.taupe,
												margin: "2px 0 0",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{s.artist}
										</p>
										<p
											style={{
												fontSize: 11,
												color: P.stone,
												margin: "1px 0 0",
											}}
										>
											{s.album}
										</p>
									</div>
									<div style={{ flexShrink: 0, textAlign: "right" }}>
										<p
											style={{
												fontSize: 12,
												color: P.stone,
												margin: "0 0 6px",
											}}
										>
											Scene {s.timestamp}
										</p>
										<button
											style={{
												fontSize: 12,
												padding: "4px 10px",
												borderRadius: 4,
												backgroundColor: P.wine,
												color: P.cream,
												border: "none",
												cursor: "pointer",
											}}
										>
											▶ Preview
										</button>
									</div>
								</div>
							))}
						</div>

						<button
							style={{
								marginTop: 14,
								fontSize: 13,
								color: P.taupe,
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
								borderBottom: `1px solid ${P.stone}`,
							}}
						>
							View Full Soundtrack →
						</button>
					</div>
				)}

				{/* ── REFRESHER PANEL ── */}
				{panel === "refresher" && (
					<div
						style={{
							marginTop: 12,
							borderRadius: 10,
							padding: 20,
							backgroundColor: P.surface,
							border: `1px solid ${P.stone}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
								marginBottom: 12,
							}}
						>
							<div>
								<p
									style={{
										fontSize: 10,
										fontWeight: 700,
										letterSpacing: "0.12em",
										textTransform: "uppercase",
										color: P.stone,
										margin: "0 0 4px",
									}}
								>
									{mode === "series"
										? `Season ${ep.season} · Episode ${ep.num}`
										: "Feature Film"}
								</p>
								<span
									style={{
										fontSize: 15,
										fontWeight: 700,
										color: P.cream,
									}}
								>
									{mode === "movie"
										? "Movie Refresher"
										: `Episode Refresher — ${ep.title}`}
								</span>
							</div>
							<button
								onClick={() => setPanel(null)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: P.taupe,
									display: "flex",
									padding: 0,
									marginTop: 2,
								}}
							>
								<IcoClose />
							</button>
						</div>

						<p
							style={{
								fontSize: 14,
								lineHeight: 1.7,
								color: P.taupe,
								margin: "0 0 20px",
							}}
						>
							{refresher.summary}
						</p>

						{refresher.hasMajorSpoilers && !spoiler ? (
							<button
								onClick={() => setSpoiler(true)}
								style={{
									width: "100%",
									padding: "12px 0",
									borderRadius: 6,
									fontSize: 14,
									border: `1px dashed ${P.stone}`,
									backgroundColor: "transparent",
									color: P.taupe,
									cursor: "pointer",
									marginBottom: 8,
								}}
							>
								⚠ Reveal Major Spoilers
							</button>
						) : (
							<>
								<RefresherSection
									title="Key Events"
									items={refresher.events}
								/>
								<RefresherSection
									title="Important Characters"
									items={refresher.characters}
								/>
								<RefresherSection
									title="Key Details to Remember"
									items={refresher.keyDetails}
								/>
							</>
						)}
					</div>
				)}

				{/* ── EPISODE PANEL ── */}
				{mode === "series" && (
					<div style={{ marginTop: 32 }}>
						<p
							style={{
								fontSize: 16,
								fontWeight: 700,
								color: P.cream,
								margin: "0 0 14px",
							}}
						>
							Season 1 · Episodes
						</p>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 8,
							}}
						>
							{EPISODES.map((e) => {
								const ep_ = progress[e.id] ?? 0;
								const pct_ =
									e.duration > 0
										? Math.min((ep_ / e.duration) * 100, 100)
										: 0;
								const done_ = pct_ >= 95;
								const now = e.id === epId;
								return (
									<button
										key={e.id}
										onClick={() => selectEp(e.id)}
										style={{
											display: "flex",
											gap: 12,
											padding: "10px 12px",
											borderRadius: 10,
											cursor: "pointer",
											textAlign: "left",
											width: "100%",
											backgroundColor: now
												? "rgba(73,17,28,0.18)"
												: P.surface,
											border: `1px solid ${now ? P.wine : P.border}`,
										}}
									>
										{/* Thumbnail */}
										<div
											style={{
												position: "relative",
												width: 120,
												aspectRatio: "16/9",
												flexShrink: 0,
												borderRadius: 6,
												overflow: "hidden",
												backgroundColor: "#120808",
											}}
										>
											<div
												style={{
													width: "100%",
													height: "100%",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													background: `linear-gradient(135deg, ${e.num % 2 === 0 ? "#0a140a" : "#0a0a14"} 0%, #140808 100%)`,
												}}
											>
												<span
													style={{
														fontSize: 32,
														fontWeight: 900,
														color: P.cream,
														opacity: 0.15,
													}}
												>
													E{e.num}
												</span>
											</div>
											{now && (
												<div
													style={{
														position: "absolute",
														inset: 0,
														backgroundColor:
															"rgba(73,17,28,0.55)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<span
														style={{
															fontSize: 11,
															fontWeight: 800,
															letterSpacing: "0.06em",
															color: P.cream,
														}}
													>
														▶ NOW
													</span>
												</div>
											)}
											{done_ && !now && (
												<div
													style={{
														position: "absolute",
														inset: 0,
														backgroundColor: "rgba(10,9,8,0.6)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<span
														style={{
															fontSize: 20,
															color: P.cream,
														}}
													>
														✓
													</span>
												</div>
											)}
											{ep_ > 0 && (
												<div
													style={{
														position: "absolute",
														bottom: 0,
														left: 0,
														right: 0,
														height: 3,
														backgroundColor: `${P.stone}40`,
													}}
												>
													<div
														style={{
															height: "100%",
															width: `${pct_}%`,
															backgroundColor: done_
																? P.taupe
																: P.red,
														}}
													/>
												</div>
											)}
										</div>

										{/* Info */}
										<div
											style={{
												flex: 1,
												minWidth: 0,
												padding: "2px 0",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: 8,
													flexWrap: "wrap",
													marginBottom: 3,
												}}
											>
												<span
													style={{
														fontSize: 14,
														fontWeight: 600,
														color: P.cream,
													}}
												>
													{e.num}. {e.title}
												</span>
												{now && (
													<span
														style={{
															fontSize: 11,
															fontWeight: 700,
															padding: "2px 8px",
															borderRadius: 10,
															backgroundColor: P.wine,
															color: P.cream,
														}}
													>
														Now Playing
													</span>
												)}
												{done_ && !now && (
													<span
														style={{
															fontSize: 12,
															color: P.taupe,
														}}
													>
														✓ Watched
													</span>
												)}
											</div>
											<p
												style={{
													fontSize: 12,
													color: P.stone,
													margin: "0 0 6px",
												}}
											>
												{fmtDur(e.duration)}
											</p>
											<p
												style={{
													fontSize: 12,
													color: `${P.stone}CC`,
													lineHeight: 1.5,
													margin: 0,
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
													overflow: "hidden",
												}}
											>
												{e.description}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				)}

				{/* ── REACTIONS ── */}
				<div style={{ ...divider, textAlign: "center" }}>
					<p
						style={{
							fontSize: 18,
							fontWeight: 600,
							color: P.cream,
							margin: "0 0 6px",
						}}
					>
						What did you think of this{" "}
						{mode === "movie" ? "movie" : "episode"}?
					</p>
					<p style={{ fontSize: 13, color: P.taupe, margin: "0 0 28px" }}>
						{totalRxn >= 1000
							? `${(totalRxn / 1000).toFixed(1)}K`
							: totalRxn}{" "}
						reactions
					</p>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							gap: 28,
							flexWrap: "wrap",
						}}
					>
						{RXNS.map(([k, emoji, label]) => (
							<button
								key={k}
								onClick={() => react(k)}
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 5,
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: 0,
									opacity: myRxn && myRxn !== k ? 0.35 : 1,
									transition: "opacity 0.15s, transform 0.15s",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.transform = "scale(1.12)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.transform = "scale(1)")
								}
							>
								<span
									style={{
										fontSize: 32,
										filter:
											myRxn === k
												? "drop-shadow(0 0 10px rgba(229,9,20,0.7))"
												: "none",
									}}
								>
									{emoji}
								</span>
								<span
									style={{
										fontSize: 15,
										fontWeight: 600,
										color: P.cream,
									}}
								>
									{rxn[k]}
								</span>
								<span style={{ fontSize: 11, color: P.taupe }}>
									{label}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* ── COMMENTS ── */}
				<div style={divider}>
					{/* Header row */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 16,
						}}
					>
						<p
							style={{
								fontSize: 16,
								fontWeight: 700,
								color: P.cream,
								margin: 0,
							}}
						>
							{comments.length}{" "}
							{comments.length === 1 ? "Comment" : "Comments"}
						</p>
						<div style={{ display: "flex", gap: 4 }}>
							{(["best", "newest", "oldest"] as const).map((s) => (
								<button
									key={s}
									onClick={() => setSort(s)}
									style={{
										fontSize: 13,
										padding: "6px 14px",
										borderRadius: 4,
										cursor: "pointer",
										textTransform: "capitalize",
										backgroundColor:
											sort === s ? P.wine : "transparent",
										border: `1px solid ${sort === s ? P.wine : P.border}`,
										color: sort === s ? P.cream : P.taupe,
									}}
								>
									{s}
								</button>
							))}
						</div>
					</div>

					{/* Input box */}
					<div
						style={{
							borderRadius: 8,
							padding: "14px 16px",
							backgroundColor: P.surface,
							border: `1px solid ${P.border}`,
							marginBottom: 10,
						}}
					>
						<textarea
							placeholder="Sign up to join the discussion..."
							rows={2}
							style={{
								width: "100%",
								background: "transparent",
								border: "none",
								outline: "none",
								resize: "none",
								fontSize: 14,
								color: P.cream,
								fontFamily: "inherit",
							}}
						/>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								borderTop: `1px solid ${P.border}`,
								paddingTop: 12,
								marginTop: 8,
							}}
						>
							<div style={{ display: "flex", gap: 14, color: P.stone }}>
								<button
									style={{
										fontSize: 14,
										fontWeight: 800,
										background: "none",
										border: "none",
										cursor: "pointer",
										color: P.stone,
										padding: 0,
									}}
								>
									B
								</button>
								<button
									style={{
										fontSize: 14,
										fontStyle: "italic",
										background: "none",
										border: "none",
										cursor: "pointer",
										color: P.stone,
										padding: 0,
									}}
								>
									I
								</button>
								<button
									style={{
										fontSize: 16,
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: 0,
									}}
								>
									😊
								</button>
							</div>
							<button
								style={{
									fontSize: 12,
									fontWeight: 700,
									padding: "7px 14px",
									borderRadius: 4,
									backgroundColor: P.wine,
									color: P.cream,
									border: "none",
									cursor: "pointer",
									letterSpacing: "0.04em",
								}}
							>
								+ SIGN UP TO COMMENT
							</button>
						</div>
					</div>

					{/* Rules */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: 28,
							padding: "0 2px",
						}}
					>
						<span style={{ fontSize: 12, color: P.stone }}>
							By commenting, you agree to follow our{" "}
							<span
								style={{
									color: P.taupe,
									cursor: "pointer",
									borderBottom: `1px solid ${P.stone}`,
								}}
							>
								comment rules
							</span>
							.
						</span>
						<button
							style={{
								fontSize: 12,
								padding: "5px 12px",
								borderRadius: 4,
								border: `1px solid ${P.stone}`,
								color: P.taupe,
								background: "none",
								cursor: "pointer",
							}}
						>
							READ RULES
						</button>
					</div>

					{/* Comment list */}
					<div
						style={{ display: "flex", flexDirection: "column", gap: 20 }}
					>
						{comments.map((c) => (
							<CommentCard key={c.id} comment={c} />
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
