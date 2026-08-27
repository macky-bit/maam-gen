import { useState, useRef, useEffect } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
const INK = "#0A0908";
const WINE = "#49111C";
const CREAM = "#F2F4F3";
const TAUPE = "#A9927D";
const STONE = "#5E503F";
const RED = "#E50914";
const STONE_BORDER = "rgba(94,80,63,0.35)";
const INK_GLASS = "rgba(10,9,8,0.88)";
const WINE_TINT = "rgba(73,17,28,0.18)";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Show {
	id: number;
	title: string;
	genres: string[];
	seasons: number;
	year: number;
	rating: string;
	match: number;
	desc: string;
	poster: string;
	wide?: string;
	isOriginal?: boolean;
	badge?: string;
	cast?: string;
	bg?: string;
}

interface WatchItem {
	showId: number;
	season: number;
	episode: number;
	epTitle: string;
	pct: number;
	remaining: string;
	watched: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const SHOWS: Show[] = [
	{
		id: 1,
		title: "SHADOWFALL",
		genres: ["Thriller", "Crime", "Drama"],
		seasons: 3,
		year: 2026,
		rating: "TV-MA",
		match: 96,
		desc: "After a brilliant forensic investigator loses everything to a shadowy syndicate, she embarks on a relentless pursuit through the world's most dangerous cities to dismantle the conspiracy from within.",
		poster:
			"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop&auto=format",
		wide: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&h=800&fit=crop&auto=format",
		isOriginal: true,
		cast: "Elena Vasquez, Marco Diaz, Jin-Ho Park",
		bg: "#1a0a15",
	},
	{
		id: 2,
		title: "Dark Requiem",
		genres: ["Crime", "Drama"],
		seasons: 2,
		year: 2025,
		rating: "TV-MA",
		match: 92,
		desc: "A washed-up detective is pulled back into service when ritualistic murders lead to the heart of a powerful criminal empire.",
		poster:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "James Okafor, Sofia Reyes",
		bg: "#0d1520",
	},
	{
		id: 3,
		title: "Nexus Protocol",
		genres: ["Sci-Fi & Fantasy", "Thriller"],
		seasons: 1,
		year: 2026,
		rating: "TV-14",
		match: 88,
		desc: "A quantum physicist discovers her consciousness can inhabit alternate timelines, entangling her in an intergovernmental war over reality itself.",
		poster:
			"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		badge: "New Series",
		cast: "Yuki Tanaka, Daniel Webb",
		bg: "#050d1f",
	},
	{
		id: 4,
		title: "Seoul Nights",
		genres: ["K-Dramas", "Romance", "Drama"],
		seasons: 3,
		year: 2025,
		rating: "TV-14",
		match: 94,
		desc: "A corporate heiress and a street musician discover their lives are intertwined through a family secret spanning three decades.",
		poster:
			"https://images.unsplash.com/photo-1617369120004-4620c5af7c6a?w=300&h=450&fit=crop&auto=format",
		badge: "New Season",
		cast: "Ji-Yeon Kim, Min-Jun Lee",
		bg: "#12070d",
	},
	{
		id: 5,
		title: "The Hunted",
		genres: ["Thriller", "Action"],
		seasons: 2,
		year: 2026,
		rating: "TV-MA",
		match: 87,
		desc: "A former black-ops agent goes off the grid after discovering her own agency has marked her for termination.",
		poster:
			"https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop&auto=format",
		cast: "Ana Costa, Brett Williams",
		bg: "#0f1208",
	},
	{
		id: 6,
		title: "Crown of Ashes",
		genres: ["Drama", "British"],
		seasons: 4,
		year: 2024,
		rating: "TV-14",
		match: 91,
		desc: "The fall of an aristocratic dynasty during the last century of empire, told through four generations of a single family.",
		poster:
			"https://images.unsplash.com/photo-1502899576159-f224dc2349ad?w=300&h=450&fit=crop&auto=format",
		cast: "Charlotte Vane, Robert Ashby",
		bg: "#1a1008",
	},
	{
		id: 7,
		title: "Midnight Files",
		genres: ["Crime", "Mysteries"],
		seasons: 1,
		year: 2026,
		rating: "TV-MA",
		match: 85,
		desc: "A forensic archivist uncovers decades of buried case files pointing to a single serial offender operating in plain sight.",
		poster:
			"https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Priya Nair, Sam Osei",
		bg: "#080808",
	},
	{
		id: 8,
		title: "Neon Citadel",
		genres: ["Sci-Fi & Fantasy", "Action"],
		seasons: 2,
		year: 2025,
		rating: "TV-MA",
		match: 89,
		desc: "In a rain-slicked megacity of 2077, a rogue AI rebellion forces a disgraced cop to choose between humanity and a new form of consciousness.",
		poster:
			"https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Kevin Park, Rina Suzuki",
		bg: "#040d1a",
	},
	{
		id: 9,
		title: "The Great Unraveling",
		genres: ["Comedies", "Drama"],
		seasons: 3,
		year: 2025,
		rating: "TV-14",
		match: 90,
		desc: "A neurotically organized event planner's perfectly constructed life collapses spectacularly over one chaotic week.",
		poster:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=450&fit=crop&auto=format",
		cast: "Maya Goldstein, Tom Rivera",
		bg: "#1a0f08",
	},
	{
		id: 10,
		title: "Obsidian Peak",
		genres: ["Action", "Thriller"],
		seasons: 2,
		year: 2026,
		rating: "TV-MA",
		match: 83,
		desc: "A mountain rescue team discovers a black-site facility buried beneath their jurisdiction, triggering a deadly cover-up.",
		poster:
			"https://images.unsplash.com/photo-1499336315816-097655dcfbda?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Viktor Novak, Zara Okafor",
		bg: "#080f0f",
	},
	{
		id: 11,
		title: "Hollow Earth Chronicles",
		genres: ["Sci-Fi & Fantasy", "Action"],
		seasons: 1,
		year: 2026,
		rating: "TV-PG",
		match: 86,
		desc: "An international expedition discovers a hidden civilization that has been watching the surface world for millennia.",
		poster:
			"https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Dr. Asha Patel, Felix Okonkwo",
		bg: "#0a1214",
	},
	{
		id: 12,
		title: "The Weight of Silence",
		genres: ["Drama", "Romance"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 93,
		desc: "A celebrated author retreats to a remote island and confronts the real story she has been avoiding her entire life.",
		poster:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=450&fit=crop&auto=format",
		cast: "Helena Marsh, Owen Clare",
		bg: "#0d0a0f",
	},
	{
		id: 13,
		title: "Iron District",
		genres: ["Crime", "Action", "Drama"],
		seasons: 3,
		year: 2024,
		rating: "TV-MA",
		match: 88,
		desc: "The battle for control of an industrial port city plays out across three rival factions — union bosses, a new cartel, and a renegade task force.",
		poster:
			"https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Diego Cruz, Eva Horváth, Bill Nwachukwu",
		bg: "#0f0f0f",
	},
	{
		id: 14,
		title: "Tangled Stars",
		genres: ["Sci-Fi & Fantasy", "Romance"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 80,
		desc: "Two astronauts stranded in deep space discover their mission was never what they were told — and neither are their feelings for each other.",
		poster:
			"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=450&fit=crop&auto=format",
		cast: "Naomi Clarke, Erik Sund",
		bg: "#030812",
	},
	{
		id: 15,
		title: "Wildfire Season",
		genres: ["Drama"],
		seasons: 1,
		year: 2026,
		rating: "TV-14",
		match: 84,
		desc: "Documentary-style drama following six wildfire fighters over a catastrophic summer that changes everything.",
		poster:
			"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Rosa Fuentes, Andre Lepage",
		bg: "#1a0800",
	},
	{
		id: 16,
		title: "Vantage Point",
		genres: ["Thriller", "Crime"],
		seasons: 2,
		year: 2025,
		rating: "TV-MA",
		match: 87,
		desc: "Five strangers witness the same event from different perspectives, each holding a crucial piece of a vast conspiracy.",
		poster:
			"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=300&h=450&fit=crop&auto=format",
		cast: "Irina Morozova, Carlos Mendez",
		bg: "#0f0f14",
	},
	{
		id: 17,
		title: "Glass Empire",
		genres: ["Drama", "British"],
		seasons: 3,
		year: 2024,
		rating: "TV-14",
		match: 92,
		desc: "A tech billionaire's family fractures as competing heirs fight for control of the world's largest data company.",
		poster:
			"https://images.unsplash.com/photo-1541752171745-e1b53eeaddc6?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Cecilia Holt, Victor Strand",
		bg: "#080c14",
	},
	{
		id: 18,
		title: "Last Breath",
		genres: ["Action", "Thriller"],
		seasons: 1,
		year: 2026,
		rating: "TV-MA",
		match: 85,
		desc: "An elite freediver discovers a Russian arms cache on the ocean floor and must outmaneuver both governments and criminals.",
		poster:
			"https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Marina Volkov, Takeshi Ogawa",
		bg: "#040f16",
	},
	{
		id: 19,
		title: "Blooms & Ruins",
		genres: ["K-Dramas", "Romance", "Comedies"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 91,
		desc: "A pragmatic botanist and a charismatic architect clash over a historic garden slated for demolition — and repeatedly.",
		poster:
			"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=450&fit=crop&auto=format",
		cast: "Soo-Jin Bae, Hyun-Soo Choi",
		bg: "#0d0a12",
	},
	{
		id: 20,
		title: "System Error",
		genres: ["Sci-Fi & Fantasy", "Comedies"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 79,
		desc: "A mid-level tech employee discovers she's living inside a simulation and decides to hack it — corporate hierarchy first.",
		poster:
			"https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Zoe Lin, Marcus Webb",
		bg: "#040d0f",
	},
	{
		id: 21,
		title: "Cartels of the Sun",
		genres: ["Crime", "Drama", "Action"],
		seasons: 4,
		year: 2024,
		rating: "TV-MA",
		match: 95,
		desc: "A DEA agent goes deep undercover inside the most powerful drug trafficking organization in the Western Hemisphere.",
		poster:
			"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=450&fit=crop&auto=format",
		cast: "Roberto Vega, Lucia Montoya",
		bg: "#0f0600",
	},
	{
		id: 22,
		title: "Echo Protocol",
		genres: ["Sci-Fi & Fantasy", "Thriller"],
		seasons: 1,
		year: 2026,
		rating: "TV-14",
		match: 82,
		desc: "A linguist is recruited by a clandestine agency to decode transmissions from an entity that may not be extraterrestrial.",
		poster:
			"https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		isOriginal: true,
		cast: "Dr. Amara Nkosi, Agent Reese",
		bg: "#040810",
	},
	{
		id: 23,
		title: "Tidal",
		genres: ["Drama", "Romance"],
		seasons: 3,
		year: 2025,
		rating: "TV-14",
		match: 88,
		desc: "A marine biologist and a lighthouse keeper on a remote Norwegian island navigate love, loss, and the rising sea.",
		poster:
			"https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=300&h=450&fit=crop&auto=format",
		cast: "Astrid Lund, Erik Dalsgaard",
		bg: "#061014",
	},
	{
		id: 24,
		title: "Reckon",
		genres: ["Crime", "Action"],
		seasons: 2,
		year: 2026,
		rating: "TV-MA",
		match: 86,
		desc: "A retired bounty hunter is forced back into the field when her daughter is taken by a cartel she helped dismantle.",
		poster:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Carmen Reyes, Agent Parker",
		bg: "#100808",
	},
	{
		id: 25,
		title: "Parallel Lives",
		genres: ["Drama", "Sci-Fi & Fantasy"],
		seasons: 1,
		year: 2026,
		rating: "TV-14",
		match: 77,
		desc: "Three strangers living in the same apartment in different decades discover their choices are inexplicably linked.",
		poster:
			"https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Nina Vogt, Oliver Hayes, Yuki Sato",
		bg: "#060810",
	},
	{
		id: 26,
		title: "Reverie Hotel",
		genres: ["Mysteries", "Horror", "Drama"],
		seasons: 2,
		year: 2025,
		rating: "TV-MA",
		match: 83,
		desc: "The staff and guests of a grand mountain resort confront supernatural events that grow more terrifying each winter.",
		poster:
			"https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=300&h=450&fit=crop&auto=format",
		cast: "Eleanor Voss, Dorian Shah",
		bg: "#0c0810",
	},
	{
		id: 27,
		title: "Reckless Hearts",
		genres: ["Romance", "Comedies"],
		seasons: 4,
		year: 2024,
		rating: "TV-14",
		match: 85,
		desc: "A revolving cast of lovably disastrous singles navigate modern dating in a chaotic shared Brooklyn apartment.",
		poster:
			"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&h=450&fit=crop&auto=format",
		cast: "Jamie Fox, Kate Summer, Chris Park",
		bg: "#12080c",
	},
	{
		id: 28,
		title: "Terra Firma",
		genres: ["Science & Nature", "Documentaries"],
		seasons: 1,
		year: 2026,
		rating: "TV-G",
		match: 90,
		desc: "A landmark six-part series following Earth's most extreme ecosystems and the scientists fighting to preserve them.",
		poster:
			"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		isOriginal: true,
		cast: "Dr. Mia Hansen",
		bg: "#051008",
	},
	{
		id: 29,
		title: "The Signal",
		genres: ["Sci-Fi & Fantasy", "Thriller"],
		seasons: 3,
		year: 2025,
		rating: "TV-14",
		match: 89,
		desc: "A radio astronomer detects a repeating signal from a distant star — and realizes someone has already been responding for twenty years.",
		poster:
			"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Dr. Lena Müller, Commander Walsh",
		bg: "#030812",
	},
	{
		id: 30,
		title: "Crescent City Blues",
		genres: ["Crime", "Drama", "Comedies"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 87,
		desc: "A jazz musician moonlights as an unlicensed private investigator in New Orleans, solving crimes one gig at a time.",
		poster:
			"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=450&fit=crop&auto=format",
		cast: "Antoine Broussard, Vivienne Tran",
		bg: "#100c04",
	},
	{
		id: 31,
		title: "Heist Republic",
		genres: ["Crime", "Action", "Comedies"],
		seasons: 2,
		year: 2026,
		rating: "TV-14",
		match: 93,
		desc: "A motley crew of specialist thieves plan the perfect heist against a museum hiding stolen wartime treasure.",
		poster:
			"https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&h=450&fit=crop&auto=format",
		badge: "New Season",
		isOriginal: true,
		cast: "Marco Bianchi, Keiko Yamamoto",
		bg: "#100c04",
	},
	{
		id: 32,
		title: "Dynasty of Wolves",
		genres: ["Drama", "Action"],
		seasons: 5,
		year: 2023,
		rating: "TV-MA",
		match: 91,
		desc: "An epic saga of rival noble houses in a fractured medieval kingdom, where loyalty shifts like the seasons.",
		poster:
			"https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop&auto=format",
		cast: "Ragnar Bjorn, Seraphina Castle",
		bg: "#0f0a06",
	},
	{
		id: 33,
		title: "The Sommelier",
		genres: ["Comedies", "Food & Travel"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 82,
		desc: "A disgraced Michelin-starred chef reinvents himself as a small-town wine dealer with very large ambitions.",
		poster:
			"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=450&fit=crop&auto=format",
		cast: "Pierre Duval, Margot Shaw",
		bg: "#120a06",
	},
	{
		id: 34,
		title: "Raven Protocol",
		genres: ["Thriller", "Sci-Fi & Fantasy"],
		seasons: 1,
		year: 2026,
		rating: "TV-MA",
		match: 84,
		desc: "A neurosurgeon is recruited to develop a mind-reading implant for intelligence use — until she becomes the first test subject.",
		poster:
			"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Dr. Anya Kovacs, Director Pierce",
		bg: "#080410",
	},
	{
		id: 35,
		title: "Sakura Code",
		genres: ["K-Dramas", "Thriller"],
		seasons: 2,
		year: 2025,
		rating: "TV-MA",
		match: 88,
		desc: "A cryptographer embedded in Tokyo's financial district unravels a deep-state operation run through the banking system.",
		poster:
			"https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Hana Watanabe, Jin Kato",
		bg: "#0c0810",
	},
	{
		id: 36,
		title: "The Outliers",
		genres: ["Drama", "Sci-Fi & Fantasy"],
		seasons: 3,
		year: 2024,
		rating: "TV-14",
		match: 90,
		desc: "Six teenagers with inexplicable abilities are recruited by a classified program — none know they share a common origin.",
		poster:
			"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=450&fit=crop&auto=format",
		isOriginal: true,
		cast: "Teen ensemble cast",
		bg: "#0a0612",
	},
	{
		id: 37,
		title: "Bad Latitude",
		genres: ["Comedies", "Crime"],
		seasons: 3,
		year: 2024,
		rating: "TV-14",
		match: 86,
		desc: "Three amateur sleuth friends stumble into increasingly dangerous real crimes while running a true-crime podcast.",
		poster:
			"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=450&fit=crop&auto=format",
		cast: "Dani Osei, Marco Reyes, Priya Rao",
		bg: "#100c08",
	},
	{
		id: 38,
		title: "Arctic Dispatch",
		genres: ["Drama", "Action"],
		seasons: 1,
		year: 2026,
		rating: "TV-14",
		match: 81,
		desc: "A journalist embedded at a remote Arctic research station uncovers a military secret that was meant to stay frozen.",
		poster:
			"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		cast: "Freya Hansen, Dr. Tomás Varga",
		bg: "#060e14",
	},
	{
		id: 39,
		title: "Inheritance",
		genres: ["Drama", "Mysteries", "British"],
		seasons: 2,
		year: 2025,
		rating: "TV-14",
		match: 89,
		desc: "A family solicitor discovers that a century-old property dispute conceals a murder never recorded as a crime.",
		poster:
			"https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=300&h=450&fit=crop&auto=format",
		cast: "Florence Ward, Alistair Croft",
		bg: "#0f0c08",
	},
	{
		id: 40,
		title: "Pressure Drop",
		genres: ["Action", "Thriller"],
		seasons: 1,
		year: 2026,
		rating: "TV-MA",
		match: 83,
		desc: "An elite navy diver recovers a classified submarine black box — and becomes the most wanted person on the planet.",
		poster:
			"https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=300&h=450&fit=crop&auto=format",
		badge: "New Series",
		isOriginal: true,
		cast: "Commander Raye, Agent Torres",
		bg: "#040c12",
	},
];

const WATCH_ITEMS: WatchItem[] = [
	{
		showId: 2,
		season: 2,
		episode: 5,
		epTitle: "The Long Shadow",
		pct: 60,
		remaining: "18 min remaining",
		watched: false,
	},
	{
		showId: 3,
		season: 1,
		episode: 3,
		epTitle: "Fork in the Code",
		pct: 40,
		remaining: "32 min remaining",
		watched: false,
	},
	{
		showId: 4,
		season: 3,
		episode: 7,
		epTitle: "Where Rivers End",
		pct: 90,
		remaining: "5 min remaining",
		watched: false,
	},
	{
		showId: 5,
		season: 1,
		episode: 1,
		epTitle: "Burn Notice",
		pct: 55,
		remaining: "22 min remaining",
		watched: false,
	},
	{
		showId: 6,
		season: 2,
		episode: 4,
		epTitle: "Dust and Memory",
		pct: 100,
		remaining: "",
		watched: true,
	},
	{
		showId: 7,
		season: 1,
		episode: 8,
		epTitle: "Cold Archive",
		pct: 25,
		remaining: "47 min remaining",
		watched: false,
	},
];

const GENRE_COLS = [
	[
		"Action",
		"Anime",
		"Asian",
		"British",
		"Comedies",
		"Crime",
		"Documentaries",
		"Dramas",
	],
	[
		"Emmy Winners",
		"European",
		"Food & Travel",
		"Horror",
		"K-Dramas",
		"Kids",
		"Mysteries",
		"Reality & Talk",
	],
	[
		"Romance",
		"Sci-Fi & Fantasy",
		"Science & Nature",
		"Sports",
		"Teen",
		"Thriller",
		"US TV Shows",
	],
];

const TOP10 = [1, 2, 8, 4, 5, 6, 7, 9, 10, 11];

const ROWS = [
	{
		id: "trending",
		label: "Trending Now",
		ids: [1, 8, 21, 29, 13, 31, 36, 35, 16, 17],
	},
	{
		id: "new",
		label: "New Releases",
		ids: [3, 7, 11, 15, 18, 22, 25, 28, 34, 38, 40],
	},
	{
		id: "popular",
		label: "Popular TV Shows",
		ids: [1, 2, 4, 6, 9, 13, 21, 32, 36, 37],
	},
	{
		id: "acclaimed",
		label: "Critically Acclaimed Series",
		ids: [6, 13, 21, 29, 32, 36, 17, 24, 30, 39],
	},
	{
		id: "binge",
		label: "Binge-Worthy Shows",
		ids: [31, 37, 30, 27, 33, 19, 20, 9, 21, 13],
	},
	{
		id: "originals",
		label: "StreamFlix Originals",
		ids: [1, 3, 8, 10, 13, 17, 20, 22, 24, 28, 29, 31, 34, 35, 36, 40],
	},
	{
		id: "crime",
		label: "Crime TV Shows",
		ids: [2, 5, 7, 13, 16, 21, 24, 30, 31, 37, 40],
	},
	{ id: "kdramas", label: "K-Dramas", ids: [4, 19, 35] },
	{
		id: "scifi",
		label: "Sci-Fi & Fantasy",
		ids: [3, 8, 11, 14, 20, 22, 25, 29, 34, 36],
	},
	{ id: "comedy", label: "Comedies", ids: [9, 19, 20, 27, 30, 33, 37] },
	{ id: "drama", label: "Dramas", ids: [6, 12, 15, 17, 23, 25, 30, 32, 39] },
	{
		id: "because",
		label: "Because You Watched SHADOWFALL",
		ids: [5, 16, 24, 40, 34, 29, 3, 8],
	},
];

const showMap = new Map(SHOWS.map((s) => [s.id, s]));
const getShows = (ids: number[]) =>
	ids.map((id) => showMap.get(id)).filter(Boolean) as Show[];
const matchGenre = (show: Show, genre: string) => {
	if (!genre || genre === "All Genres") return true;
	const g = genre.toLowerCase();
	return show.genres.some(
		(sg) =>
			sg.toLowerCase() === g ||
			sg.toLowerCase().includes(g) ||
			g.includes(sg.toLowerCase()),
	);
};

// ── Icon helpers ──────────────────────────────────────────────────────────────
const PlayIcon = ({ size = 16 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
		<polygon points="5,3 19,12 5,21" />
	</svg>
);
const InfoIcon = ({ size = 16 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="8" x2="12" y2="12" />
		<line x1="12" y1="16" x2="12.01" y2="16" />
	</svg>
);
const PlusIcon = ({ size = 14 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
	>
		<line x1="12" y1="5" x2="12" y2="19" />
		<line x1="5" y1="12" x2="19" y2="12" />
	</svg>
);
const CheckIcon = ({ size = 14 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);
const ThumbsUpIcon = ({ size = 14 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
		<path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
	</svg>
);
const ChevronDownIcon = ({ size = 14 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
	>
		<polyline points="6 9 12 15 18 9" />
	</svg>
);
const ChevronLeftIcon = ({ size = 20 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<polyline points="15 18 9 12 15 6" />
	</svg>
);
const ChevronRightIcon = ({ size = 20 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<polyline points="9 18 15 12 9 6" />
	</svg>
);
const VolumeOffIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
		<line x1="23" y1="9" x2="17" y2="15" />
		<line x1="17" y1="9" x2="23" y2="15" />
	</svg>
);
const VolumeIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
		<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
		<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
	</svg>
);
const XIcon = ({ size = 20 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<line x1="18" y1="6" x2="6" y2="18" />
		<line x1="6" y1="6" x2="18" y2="18" />
	</svg>
);
const SearchIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<circle cx="11" cy="11" r="8" />
		<line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>
);
const BellIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
		<path d="M13.73 21a2 2 0 0 1-3.46 0" />
	</svg>
);

// ── Shared small components ───────────────────────────────────────────────────
function Badge({
	label,
	bg = WINE,
	color = CREAM,
	border,
}: {
	label: string;
	bg?: string;
	color?: string;
	border?: string;
}) {
	return (
		<span
			style={{
				fontFamily: "'Inter', sans-serif",
				fontSize: 11,
				fontWeight: 400,
				padding: "2px 6px",
				borderRadius: 3,
				background: bg,
				color,
				border: border ? `1px solid ${border}` : undefined,
				letterSpacing: "0.02em",
				lineHeight: 1.4,
				flexShrink: 0,
			}}
		>
			{label}
		</span>
	);
}

function IconBtn({
	children,
	onClick,
	title,
	active,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	title?: string;
	active?: boolean;
}) {
	return (
		<button
			title={title}
			onClick={onClick}
			style={{
				background: active ? STONE_BORDER : "rgba(10,9,8,0.5)",
				border: `1px solid ${STONE_BORDER}`,
				borderRadius: "50%",
				width: 34,
				height: 34,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
				color: CREAM,
				transition: "background 0.15s, border-color 0.15s",
				flexShrink: 0,
			}}
			onMouseEnter={(e) =>
				(e.currentTarget.style.background = "rgba(94,80,63,0.45)")
			}
			onMouseLeave={(e) =>
				(e.currentTarget.style.background = active
					? STONE_BORDER
					: "rgba(10,9,8,0.5)")
			}
		>
			{children}
		</button>
	);
}

// ── Carousel wrapper ──────────────────────────────────────────────────────────
function Carousel({
	children,
	itemWidth = 160,
}: {
	children: React.ReactNode;
	itemWidth?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(true);

	const update = () => {
		const el = ref.current;
		if (!el) return;
		setCanLeft(el.scrollLeft > 4);
		setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
	};

	useEffect(() => {
		update();
	}, [children]);

	const scroll = (dir: "left" | "right") => {
		const el = ref.current;
		if (!el) return;
		el.scrollBy({
			left: dir === "left" ? -itemWidth * 3 : itemWidth * 3,
			behavior: "smooth",
		});
		setTimeout(update, 350);
	};

	return (
		<div style={{ position: "relative" }}>
			{canLeft && (
				<button
					onClick={() => scroll("left")}
					style={{
						position: "absolute",
						left: 0,
						top: "50%",
						transform: "translateY(-50%)",
						zIndex: 10,
						background:
							"linear-gradient(to right, rgba(10,9,8,0.9) 60%, transparent)",
						border: "none",
						cursor: "pointer",
						color: CREAM,
						width: 48,
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						padding: "0 6px",
					}}
				>
					<ChevronLeftIcon size={24} />
				</button>
			)}
			<div
				ref={ref}
				className="hide-scroll"
				onScroll={update}
				style={{
					display: "flex",
					gap: 8,
					overflowX: "auto",
					padding: "4px 0 12px",
				}}
			>
				{children}
			</div>
			{canRight && (
				<button
					onClick={() => scroll("right")}
					style={{
						position: "absolute",
						right: 0,
						top: "50%",
						transform: "translateY(-50%)",
						zIndex: 10,
						background:
							"linear-gradient(to left, rgba(10,9,8,0.9) 60%, transparent)",
						border: "none",
						cursor: "pointer",
						color: CREAM,
						width: 48,
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						padding: "0 6px",
					}}
				>
					<ChevronRightIcon size={24} />
				</button>
			)}
		</div>
	);
}

// ── Show Card ─────────────────────────────────────────────────────────────────
function ShowCard({
	show,
	inMyList,
	onToggleMyList,
	onOpen,
}: {
	show: Show;
	inMyList: boolean;
	onToggleMyList: (id: number) => void;
	onOpen: (show: Show) => void;
}) {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				position: "relative",
				flexShrink: 0,
				width: 148,
				cursor: "pointer",
			}}
		>
			{/* Poster */}
			<div
				style={{
					width: 148,
					height: 222,
					borderRadius: 6,
					overflow: "hidden",
					background: show.bg || "#111",
					border: hovered ? `1px solid ${STONE}` : "1px solid transparent",
					transition: "border-color 0.15s",
					position: "relative",
				}}
			>
				<img
					src={show.poster}
					alt={show.title}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						display: "block",
					}}
					loading="lazy"
				/>
				{show.badge && (
					<div style={{ position: "absolute", top: 8, left: 8 }}>
						<Badge label={show.badge} bg={WINE} color={CREAM} />
					</div>
				)}
				{show.isOriginal && !show.badge && (
					<div style={{ position: "absolute", top: 8, left: 8 }}>
						<Badge
							label="Original"
							bg="rgba(73,17,28,0.85)"
							color={TAUPE}
							border={STONE}
						/>
					</div>
				)}
			</div>

			{/* Hover overlay */}
			{hovered && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: "50%",
						transform: "translateX(-50%)",
						width: 220,
						zIndex: 30,
						background: INK_GLASS,
						backdropFilter: "blur(20px) saturate(180%)",
						WebkitBackdropFilter: "blur(20px) saturate(180%)",
						border: `1px solid ${STONE_BORDER}`,
						borderRadius: 8,
						padding: "12px",
						boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
						marginTop: 4,
					}}
				>
					{/* Arrow */}
					<div
						style={{
							position: "absolute",
							top: -6,
							left: "50%",
							transform: "translateX(-50%)",
							width: 10,
							height: 6,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								width: 10,
								height: 10,
								background: INK_GLASS,
								border: `1px solid ${STONE_BORDER}`,
								transform: "rotate(45deg)",
								transformOrigin: "center",
								marginTop: 3,
							}}
						/>
					</div>

					{/* Actions */}
					<div
						style={{
							display: "flex",
							gap: 6,
							marginBottom: 10,
							alignItems: "center",
						}}
					>
						<button
							onClick={() => onOpen(show)}
							style={{
								background: CREAM,
								color: INK,
								border: "none",
								borderRadius: "50%",
								width: 30,
								height: 30,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								flexShrink: 0,
								paddingLeft: 2,
							}}
						>
							<PlayIcon size={13} />
						</button>
						<IconBtn
							onClick={() => onToggleMyList(show.id)}
							title={inMyList ? "Remove from My List" : "Add to My List"}
						>
							{inMyList ? <CheckIcon /> : <PlusIcon />}
						</IconBtn>
						<IconBtn title="I like this">
							<ThumbsUpIcon />
						</IconBtn>
						<button
							onClick={() => onOpen(show)}
							style={{
								marginLeft: "auto",
								background: "none",
								border: `1px solid ${STONE_BORDER}`,
								borderRadius: "50%",
								width: 30,
								height: 30,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								color: CREAM,
								flexShrink: 0,
							}}
						>
							<ChevronDownIcon size={14} />
						</button>
					</div>

					{/* Meta */}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 4,
							alignItems: "center",
							marginBottom: 6,
						}}
					>
						<span
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 12,
								fontWeight: 600,
								color: WINE,
							}}
						>
							{show.match}% Match
						</span>
						<span
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 12,
								color: TAUPE,
							}}
						>
							{show.year}
						</span>
						<Badge
							label={show.rating}
							bg="transparent"
							color={TAUPE}
							border={STONE}
						/>
						<span
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 12,
								color: TAUPE,
							}}
						>
							{show.seasons}S
						</span>
					</div>

					<div
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 12,
							color: TAUPE,
							lineHeight: 1.4,
						}}
					>
						{show.genres.slice(0, 2).join(" · ")}
					</div>
				</div>
			)}
		</div>
	);
}

// ── ShowRow ───────────────────────────────────────────────────────────────────
function ShowRow({
	label,
	shows,
	myList,
	onToggleMyList,
	onOpen,
	exploreAll = false,
}: {
	label: string;
	shows: Show[];
	myList: Set<number>;
	onToggleMyList: (id: number) => void;
	onOpen: (show: Show) => void;
	exploreAll?: boolean;
}) {
	if (shows.length === 0) return null;
	return (
		<section style={{ padding: "0 48px", marginBottom: 40 }}>
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					gap: 12,
					marginBottom: 10,
				}}
			>
				<h2
					style={{
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: 20,
						fontWeight: 700,
						color: CREAM,
						margin: 0,
						lineHeight: 1.2,
					}}
				>
					{label}
				</h2>
				{exploreAll && (
					<a
						href="#"
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							fontWeight: 500,
							color: WINE,
							textDecoration: "none",
						}}
					>
						Explore All ›
					</a>
				)}
			</div>
			<Carousel itemWidth={156}>
				{shows.map((show) => (
					<ShowCard
						key={show.id}
						show={show}
						inMyList={myList.has(show.id)}
						onToggleMyList={onToggleMyList}
						onOpen={onOpen}
					/>
				))}
			</Carousel>
		</section>
	);
}

// ── Top10 Row ─────────────────────────────────────────────────────────────────
function Top10Row({
	ids,
	myList,
	onToggleMyList,
	onOpen,
}: {
	ids: number[];
	myList: Set<number>;
	onToggleMyList: (id: number) => void;
	onOpen: (show: Show) => void;
}) {
	const shows = getShows(ids);
	return (
		<section style={{ padding: "0 48px", marginBottom: 40 }}>
			<h2
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 20,
					fontWeight: 700,
					color: CREAM,
					margin: "0 0 10px",
					lineHeight: 1.2,
				}}
			>
				Top 10 in Your Country Today
			</h2>
			<Carousel itemWidth={196}>
				{shows.map((show, i) => (
					<div
						key={show.id}
						style={{
							position: "relative",
							flexShrink: 0,
							width: 188,
							cursor: "pointer",
						}}
						onClick={() => onOpen(show)}
					>
						{/* Rank number */}
						<div
							style={{
								position: "absolute",
								left: -18,
								bottom: -8,
								zIndex: 2,
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 110,
								fontWeight: 800,
								lineHeight: 1,
								color: "transparent",
								WebkitTextStroke: `2px ${STONE}`,
								letterSpacing: "-0.04em",
								userSelect: "none",
							}}
						>
							{i + 1}
						</div>
						<div
							style={{
								width: 130,
								height: 195,
								borderRadius: 6,
								overflow: "hidden",
								background: show.bg || "#111",
								marginLeft: 58,
								border: `1px solid ${STONE_BORDER}`,
								position: "relative",
							}}
						>
							<img
								src={show.poster}
								alt={show.title}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									display: "block",
								}}
								loading="lazy"
							/>
							<div
								style={{
									position: "absolute",
									inset: 0,
									background:
										"linear-gradient(to top, rgba(10,9,8,0.7) 0%, transparent 50%)",
								}}
							/>
							<div
								style={{
									position: "absolute",
									bottom: 8,
									left: 8,
									right: 8,
									fontFamily: "'Barlow Condensed', sans-serif",
									fontSize: 13,
									fontWeight: 700,
									color: CREAM,
									lineHeight: 1.2,
								}}
							>
								{show.title}
							</div>
							{myList.has(show.id) && (
								<div style={{ position: "absolute", top: 8, right: 8 }}>
									<Badge label="✓" bg={WINE} color={CREAM} />
								</div>
							)}
						</div>
					</div>
				))}
			</Carousel>
		</section>
	);
}

// ── Continue Watching Row ─────────────────────────────────────────────────────
function ContinueWatchingRow({
	items,
	myList,
	onToggleMyList,
	onOpen,
}: {
	items: WatchItem[];
	myList: Set<number>;
	onToggleMyList: (id: number) => void;
	onOpen: (show: Show) => void;
}) {
	return (
		<section style={{ padding: "0 48px", marginBottom: 40 }}>
			<h2
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 20,
					fontWeight: 700,
					color: CREAM,
					margin: "0 0 10px",
					lineHeight: 1.2,
				}}
			>
				Continue Watching
			</h2>
			<Carousel itemWidth={220}>
				{items.map((item) => {
					const show = showMap.get(item.showId);
					if (!show) return null;
					return (
						<div
							key={item.showId}
							style={{ flexShrink: 0, width: 212, cursor: "pointer" }}
							onClick={() => onOpen(show)}
						>
							<div
								style={{
									width: 212,
									height: 120,
									borderRadius: 6,
									overflow: "hidden",
									background: show.bg || "#111",
									position: "relative",
									border: `1px solid ${STONE_BORDER}`,
								}}
							>
								<img
									src={show.poster}
									alt={show.title}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
										display: "block",
									}}
									loading="lazy"
								/>
								<div
									style={{
										position: "absolute",
										inset: 0,
										background:
											"linear-gradient(to top, rgba(10,9,8,0.85) 0%, transparent 55%)",
									}}
								/>
								{item.watched && (
									<div
										style={{ position: "absolute", top: 8, right: 8 }}
									>
										<Badge
											label="Watched"
											bg="rgba(94,80,63,0.7)"
											color={CREAM}
										/>
									</div>
								)}
								<div
									style={{
										position: "absolute",
										bottom: 0,
										left: 0,
										right: 0,
										padding: "0 8px 6px",
									}}
								>
									{/* Progress bar */}
									<div
										style={{
											height: 3,
											background: "rgba(94,80,63,0.4)",
											borderRadius: 2,
											marginBottom: 4,
										}}
									>
										<div
											style={{
												height: "100%",
												width: `${item.pct}%`,
												borderRadius: 2,
												background: item.watched ? STONE : WINE,
												transition: "width 0.3s",
											}}
										/>
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "baseline",
										}}
									>
										<span
											style={{
												fontFamily: "'Inter', sans-serif",
												fontSize: 11,
												color: TAUPE,
											}}
										>
											S{item.season}:E{item.episode} · {item.epTitle}
										</span>
									</div>
								</div>
							</div>
							<div style={{ padding: "6px 2px 0" }}>
								<div
									style={{
										fontFamily: "'Barlow Condensed', sans-serif",
										fontSize: 14,
										fontWeight: 700,
										color: CREAM,
										lineHeight: 1.2,
										marginBottom: 2,
									}}
								>
									{show.title}
								</div>
								{!item.watched && (
									<div
										style={{
											fontFamily: "'Inter', sans-serif",
											fontSize: 11,
											color: TAUPE,
										}}
									>
										{item.remaining}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</Carousel>
		</section>
	);
}

// ── Genres Dropdown ───────────────────────────────────────────────────────────
function GenresDropdown({
	selectedGenre,
	onSelect,
	open,
	onToggle,
}: {
	selectedGenre: string | null;
	onSelect: (g: string | null) => void;
	open: boolean;
	onToggle: () => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
		}
		function keyHandler(e: KeyboardEvent) {
			if (e.key === "Escape" && open) onToggle();
		}
		if (open) {
			document.addEventListener("mousedown", handler);
			document.addEventListener("keydown", keyHandler);
		}
		return () => {
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("keydown", keyHandler);
		};
	}, [open, onToggle]);

	const label =
		selectedGenre && selectedGenre !== "All Genres"
			? selectedGenre
			: "Genres";

	return (
		<div ref={ref} style={{ position: "relative", display: "inline-block" }}>
			<button
				onClick={onToggle}
				style={{
					display: "flex",
					alignItems: "center",
					gap: 6,
					background: open ? "rgba(94,80,63,0.2)" : "rgba(10,9,8,0.6)",
					backdropFilter: "blur(12px)",
					border: `1px solid ${open ? STONE : STONE_BORDER}`,
					borderRadius: 4,
					padding: "6px 12px",
					color: CREAM,
					cursor: "pointer",
					fontFamily: "'Inter', sans-serif",
					fontSize: 15,
					fontWeight: 600,
					transition: "background 0.15s, border-color 0.15s",
				}}
			>
				{label}
				<ChevronDownIcon size={13} />
			</button>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "calc(100% + 10px)",
						left: 0,
						zIndex: 50,
						background: "rgba(10,9,8,0.97)",
						backdropFilter: "blur(24px) saturate(180%)",
						WebkitBackdropFilter: "blur(24px) saturate(180%)",
						border: `1px solid ${STONE_BORDER}`,
						borderRadius: 8,
						boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
						padding: "8px 4px",
						minWidth: 480,
					}}
				>
					{/* Pointer */}
					<div
						style={{
							position: "absolute",
							top: -5,
							left: 18,
							width: 10,
							height: 10,
							background: "rgba(10,9,8,0.97)",
							border: `1px solid ${STONE_BORDER}`,
							transform: "rotate(45deg)",
							borderBottom: "none",
							borderRight: "none",
						}}
					/>

					{/* All Genres */}
					<div
						style={{
							padding: "4px 8px 8px",
							borderBottom: `1px solid ${STONE_BORDER}`,
							marginBottom: 6,
						}}
					>
						<button
							onClick={() => {
								onSelect(null);
								onToggle();
							}}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								color:
									!selectedGenre || selectedGenre === "All Genres"
										? CREAM
										: TAUPE,
								fontFamily: "'Inter', sans-serif",
								fontSize: 13,
								fontWeight: 500,
								padding: "4px 8px",
								borderRadius: 4,
								background:
									!selectedGenre || selectedGenre === "All Genres"
										? WINE_TINT
										: "transparent",
							}}
						>
							All Genres
						</button>
					</div>

					{/* Three columns */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr 1fr",
							gap: 0,
							padding: "4px 8px",
						}}
					>
						{GENRE_COLS.map((col, ci) => (
							<div key={ci}>
								{col.map((genre) => {
									const active = selectedGenre === genre;
									return (
										<button
											key={genre}
											onClick={() => {
												onSelect(genre);
												onToggle();
											}}
											style={{
												display: "block",
												width: "100%",
												textAlign: "left",
												background: active ? WINE_TINT : "none",
												border: "none",
												cursor: "pointer",
												color: active ? CREAM : TAUPE,
												fontFamily: "'Inter', sans-serif",
												fontSize: 13,
												fontWeight: active ? 500 : 400,
												padding: "7px 10px",
												borderRadius: 4,
												transition: "background 0.1s, color 0.1s",
											}}
											onMouseEnter={(e) => {
												(
													e.currentTarget as HTMLElement
												).style.background = WINE_TINT;
												(
													e.currentTarget as HTMLElement
												).style.color = CREAM;
											}}
											onMouseLeave={(e) => {
												(
													e.currentTarget as HTMLElement
												).style.background = active
													? WINE_TINT
													: "transparent";
												(
													e.currentTarget as HTMLElement
												).style.color = active ? CREAM : TAUPE;
											}}
										>
											{genre}
										</button>
									);
								})}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({
	show,
	muted,
	onToggleMute,
	inMyList,
	onToggleMyList,
	onOpen,
	selectedGenre,
	onGenreToggle,
	genreOpen,
}: {
	show: Show;
	muted: boolean;
	onToggleMute: () => void;
	inMyList: boolean;
	onToggleMyList: (id: number) => void;
	onOpen: (show: Show) => void;
	selectedGenre: string | null;
	onGenreToggle: () => void;
	genreOpen: boolean;
}) {
	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: 620,
				overflow: "hidden",
				marginBottom: 0,
			}}
		>
			{/* Background image */}
			<img
				src={show.wide || show.poster}
				alt={show.title}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					objectPosition: "center top",
				}}
			/>

			{/* Left gradient */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: `linear-gradient(to right, ${INK} 0%, rgba(10,9,8,0.75) 45%, transparent 75%)`,
				}}
			/>
			{/* Bottom gradient */}
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: 220,
					background: `linear-gradient(to top, ${INK} 0%, transparent 100%)`,
				}}
			/>
			{/* Top gradient (for nav) */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 120,
					background: `linear-gradient(to bottom, rgba(10,9,8,0.5) 0%, transparent 100%)`,
				}}
			/>

			{/* TV Shows heading + Genres - positioned in upper left of hero content */}
			<div
				style={{
					position: "absolute",
					left: 48,
					top: 92,
					display: "flex",
					alignItems: "center",
					gap: 20,
					zIndex: 10,
				}}
			>
				<h1
					style={{
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: 36,
						fontWeight: 800,
						color: CREAM,
						margin: 0,
						lineHeight: 1,
					}}
				>
					TV Shows
				</h1>
				<GenresDropdown
					selectedGenre={selectedGenre}
					onSelect={() => {}}
					open={genreOpen}
					onToggle={onGenreToggle}
				/>
			</div>

			{/* Hero content */}
			<div
				style={{
					position: "absolute",
					left: 48,
					bottom: 80,
					maxWidth: 560,
					zIndex: 5,
				}}
			>
				{show.isOriginal && (
					<div
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 12,
							fontWeight: 600,
							letterSpacing: "0.2em",
							textTransform: "uppercase",
							color: TAUPE,
							marginBottom: 10,
							lineHeight: "16px",
						}}
					>
						STREAMFLIX ORIGINAL
					</div>
				)}
				<h2
					style={{
						fontFamily: "'Barlow Condensed', sans-serif",
						fontSize: "clamp(44px, 6vw, 72px)",
						fontWeight: 800,
						textTransform: "uppercase",
						lineHeight: 0.95,
						letterSpacing: "-0.01em",
						color: CREAM,
						margin: "0 0 14px",
					}}
				>
					{show.title}
				</h2>

				{/* Metadata row */}
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: 10,
						alignItems: "center",
						marginBottom: 14,
					}}
				>
					<span
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							fontWeight: 700,
							color: WINE,
						}}
					>
						{show.match}% Match
					</span>
					<span
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: TAUPE,
						}}
					>
						{show.year}
					</span>
					<Badge
						label={show.rating}
						bg="transparent"
						color={TAUPE}
						border={STONE}
					/>
					<span
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: TAUPE,
						}}
					>
						{show.seasons} Seasons
					</span>
					<span
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: TAUPE,
						}}
					>
						{show.genres[0]}
					</span>
				</div>

				<p
					style={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 15,
						fontWeight: 400,
						lineHeight: 1.625,
						color: CREAM,
						margin: "0 0 22px",
					}}
				>
					{show.desc}
				</p>

				{/* Buttons */}
				<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
					<button
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							background: CREAM,
							color: INK,
							border: "none",
							borderRadius: 4,
							padding: "10px 22px",
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 16,
							fontWeight: 700,
							letterSpacing: "0.05em",
							cursor: "pointer",
							transition: "opacity 0.15s",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
						onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
					>
						<PlayIcon size={16} /> Play
					</button>
					<button
						onClick={() => onOpen(show)}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							background: WINE,
							color: CREAM,
							border: "none",
							borderRadius: 4,
							padding: "10px 22px",
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 16,
							fontWeight: 700,
							letterSpacing: "0.05em",
							cursor: "pointer",
							transition: "opacity 0.15s",
						}}
						onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
						onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
					>
						<InfoIcon size={16} /> More Info
					</button>
				</div>
			</div>

			{/* Right controls */}
			<div
				style={{
					position: "absolute",
					right: 48,
					bottom: 100,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: 10,
				}}
			>
				<button
					onClick={onToggleMute}
					style={{
						background: "transparent",
						border: `1px solid rgba(242,244,243,0.5)`,
						borderRadius: "50%",
						width: 36,
						height: 36,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						color: CREAM,
					}}
				>
					{muted ? <VolumeOffIcon size={16} /> : <VolumeIcon size={16} />}
				</button>
				<Badge
					label={show.rating}
					bg="rgba(10,9,8,0.6)"
					color={CREAM}
					border="rgba(242,244,243,0.4)"
				/>
			</div>
		</div>
	);
}

// ── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({
	show,
	inMyList,
	onToggleMyList,
	onClose,
	allShows,
}: {
	show: Show;
	inMyList: boolean;
	onToggleMyList: (id: number) => void;
	onClose: () => void;
	allShows: Show[];
}) {
	const similar = allShows
		.filter(
			(s) =>
				s.id !== show.id && s.genres.some((g) => show.genres.includes(g)),
		)
		.slice(0, 6);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handler);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handler);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 200,
				background: "rgba(10,9,8,0.85)",
				backdropFilter: "blur(6px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "20px",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: 820,
					maxHeight: "90vh",
					overflowY: "auto",
					background: "rgba(16,14,12,0.98)",
					backdropFilter: "blur(20px)",
					border: `1px solid ${STONE_BORDER}`,
					borderRadius: 12,
					boxShadow: "0 24px 80px rgba(0,0,0,0.9)",
				}}
				className="hide-scroll"
			>
				{/* Hero image */}
				<div
					style={{
						position: "relative",
						width: "100%",
						paddingTop: "56.25%",
						borderRadius: "12px 12px 0 0",
						overflow: "hidden",
					}}
				>
					<img
						src={show.wide || show.poster}
						alt={show.title}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(to top, rgba(16,14,12,1) 0%, rgba(16,14,12,0.3) 40%, transparent 70%)",
						}}
					/>

					{/* Close */}
					<button
						onClick={onClose}
						style={{
							position: "absolute",
							top: 16,
							right: 16,
							background: "rgba(10,9,8,0.7)",
							backdropFilter: "blur(8px)",
							border: `1px solid ${STONE_BORDER}`,
							borderRadius: "50%",
							width: 36,
							height: 36,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							color: CREAM,
						}}
					>
						<XIcon size={16} />
					</button>

					{/* Original label */}
					{show.isOriginal && (
						<div
							style={{
								position: "absolute",
								bottom: 60,
								left: 24,
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 12,
								fontWeight: 600,
								letterSpacing: "0.2em",
								textTransform: "uppercase",
								color: TAUPE,
							}}
						>
							STREAMFLIX ORIGINAL
						</div>
					)}

					{/* Title */}
					<h2
						style={{
							position: "absolute",
							bottom: 16,
							left: 24,
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: "clamp(30px, 4vw, 48px)",
							fontWeight: 800,
							textTransform: "uppercase",
							letterSpacing: "-0.01em",
							color: CREAM,
							margin: 0,
							lineHeight: 1,
						}}
					>
						{show.title}
					</h2>
				</div>

				{/* Content */}
				<div style={{ padding: "20px 24px 28px" }}>
					{/* Action row */}
					<div
						style={{
							display: "flex",
							gap: 8,
							marginBottom: 18,
							alignItems: "center",
						}}
					>
						<button
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								background: CREAM,
								color: INK,
								border: "none",
								borderRadius: 4,
								padding: "8px 20px",
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 15,
								fontWeight: 700,
								letterSpacing: "0.04em",
								cursor: "pointer",
							}}
						>
							<PlayIcon size={14} /> Play
						</button>
						<IconBtn
							onClick={() => onToggleMyList(show.id)}
							title={inMyList ? "Remove from My List" : "Add to My List"}
						>
							{inMyList ? <CheckIcon /> : <PlusIcon />}
						</IconBtn>
						<IconBtn title="I like this">
							<ThumbsUpIcon />
						</IconBtn>
						<div style={{ flex: 1 }} />
						<span
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 13,
								color: TAUPE,
							}}
						>
							Episodes & More ›
						</span>
					</div>

					{/* Two-column layout */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 0.45fr",
							gap: 20,
						}}
					>
						<div>
							{/* Meta */}
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: 8,
									alignItems: "center",
									marginBottom: 12,
								}}
							>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 13,
										fontWeight: 600,
										color: WINE,
									}}
								>
									{show.match}% Match
								</span>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 13,
										color: TAUPE,
									}}
								>
									{show.year}
								</span>
								<Badge
									label={show.rating}
									bg="transparent"
									color={TAUPE}
									border={STONE}
								/>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 13,
										color: TAUPE,
									}}
								>
									{show.seasons} Season{show.seasons > 1 ? "s" : ""}
								</span>
							</div>

							<p
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: 15,
									fontWeight: 400,
									lineHeight: 1.65,
									color: CREAM,
									margin: 0,
								}}
							>
								{show.desc}
							</p>
						</div>

						<div>
							{show.cast && (
								<div style={{ marginBottom: 10 }}>
									<span
										style={{
											fontFamily: "'Inter', sans-serif",
											fontSize: 12,
											color: STONE,
										}}
									>
										Cast:{" "}
									</span>
									<span
										style={{
											fontFamily: "'Inter', sans-serif",
											fontSize: 12,
											color: TAUPE,
										}}
									>
										{show.cast}
									</span>
								</div>
							)}
							<div style={{ marginBottom: 10 }}>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 12,
										color: STONE,
									}}
								>
									Genres:{" "}
								</span>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 12,
										color: TAUPE,
									}}
								>
									{show.genres.join(", ")}
								</span>
							</div>
							<div>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 12,
										color: STONE,
									}}
								>
									Rating:{" "}
								</span>
								<span
									style={{
										fontFamily: "'Inter', sans-serif",
										fontSize: 12,
										color: TAUPE,
									}}
								>
									{show.rating}
								</span>
							</div>
						</div>
					</div>

					{/* More Like This */}
					{similar.length > 0 && (
						<div style={{ marginTop: 28 }}>
							<h3
								style={{
									fontFamily: "'Barlow Condensed', sans-serif",
									fontSize: 20,
									fontWeight: 700,
									color: CREAM,
									margin: "0 0 14px",
									letterSpacing: "0.06em",
								}}
							>
								MORE LIKE THIS
							</h3>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(3, 1fr)",
									gap: 10,
								}}
							>
								{similar.map((s) => (
									<div
										key={s.id}
										style={{
											background: "rgba(94,80,63,0.08)",
											border: `1px solid ${STONE_BORDER}`,
											borderRadius: 6,
											overflow: "hidden",
											cursor: "pointer",
										}}
									>
										<div
											style={{
												width: "100%",
												paddingTop: "56%",
												position: "relative",
												background: s.bg || "#111",
											}}
										>
											<img
												src={s.poster}
												alt={s.title}
												style={{
													position: "absolute",
													inset: 0,
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
												loading="lazy"
											/>
										</div>
										<div style={{ padding: "8px 10px" }}>
											<div
												style={{
													fontFamily:
														"'Barlow Condensed', sans-serif",
													fontSize: 14,
													fontWeight: 700,
													color: CREAM,
													marginBottom: 4,
													lineHeight: 1.2,
												}}
											>
												{s.title}
											</div>
											<div
												style={{
													display: "flex",
													gap: 6,
													alignItems: "center",
													marginBottom: 4,
												}}
											>
												<span
													style={{
														fontFamily: "'Inter', sans-serif",
														fontSize: 11,
														fontWeight: 600,
														color: WINE,
													}}
												>
													{s.match}%
												</span>
												<span
													style={{
														fontFamily: "'Inter', sans-serif",
														fontSize: 11,
														color: TAUPE,
													}}
												>
													{s.year}
												</span>
												<Badge
													label={s.rating}
													bg="transparent"
													color={TAUPE}
													border={STONE}
												/>
											</div>
											<p
												style={{
													fontFamily: "'Inter', sans-serif",
													fontSize: 11,
													color: TAUPE,
													margin: 0,
													lineHeight: 1.4,
													display: "-webkit-box",
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
													overflow: "hidden",
												}}
											>
												{s.desc}
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

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({
	myListCount,
	searchOpen,
	setSearchOpen,
	searchQuery,
	setSearchQuery,
}: {
	myListCount: number;
	searchOpen: boolean;
	setSearchOpen: (v: boolean) => void;
	searchQuery: string;
	setSearchQuery: (v: string) => void;
}) {
	const [notifOpen, setNotifOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setNotifOpen(false);
				setProfileOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	return (
		<nav
			ref={ref}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 100,
				background: "rgba(10,9,8,0.9)",
				backdropFilter: "blur(16px) saturate(180%)",
				WebkitBackdropFilter: "blur(16px) saturate(180%)",
				borderBottom: `1px solid rgba(94,80,63,0.2)`,
				height: 68,
				display: "flex",
				alignItems: "center",
				padding: "0 48px",
				gap: 28,
			}}
		>
			{/* Logo */}
			<span
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 28,
					fontWeight: 800,
					letterSpacing: "0.02em",
					color: RED,
					textTransform: "uppercase",
					flexShrink: 0,
					lineHeight: 1,
				}}
			>
				STREAMFLIX
			</span>

			{/* Links */}
			<div style={{ display: "flex", gap: 20, alignItems: "center" }}>
				{["Home", "TV Shows", "Movies", "New & Popular", "My List"].map(
					(link) => {
						const isActive = link === "TV Shows";
						const label =
							link === "My List" && myListCount > 0
								? `My List (${myListCount})`
								: link;
						return (
							<a
								key={link}
								href="#"
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: 15,
									fontWeight: 500,
									textDecoration: "none",
									color: isActive ? CREAM : TAUPE,
									borderBottom: isActive
										? `2px solid ${WINE}`
										: "2px solid transparent",
									paddingBottom: 2,
									lineHeight: "24px",
									transition: "color 0.15s",
								}}
								onMouseEnter={(e) => {
									if (!isActive)
										(e.target as HTMLElement).style.color = CREAM;
								}}
								onMouseLeave={(e) => {
									if (!isActive)
										(e.target as HTMLElement).style.color = TAUPE;
								}}
							>
								{label}
							</a>
						);
					},
				)}
			</div>

			<div style={{ flex: 1 }} />

			{/* Right: search, notif, profile */}
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				{/* Search */}
				<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
					{searchOpen && (
						<input
							autoFocus
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									setSearchOpen(false);
									setSearchQuery("");
								}
							}}
							placeholder="Titles, genres, cast..."
							style={{
								background: "rgba(10,9,8,0.85)",
								backdropFilter: "blur(12px)",
								border: `1px solid ${STONE_BORDER}`,
								color: CREAM,
								padding: "5px 10px",
								borderRadius: 4,
								fontSize: 13,
								fontFamily: "'Inter', sans-serif",
								width: 200,
								outline: "none",
							}}
						/>
					)}
					<button
						onClick={() => {
							setSearchOpen(!searchOpen);
							if (searchOpen) setSearchQuery("");
						}}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							color: CREAM,
							padding: 4,
							display: "flex",
							alignItems: "center",
						}}
					>
						<SearchIcon size={18} />
					</button>
				</div>

				{/* Notifications */}
				<div style={{ position: "relative" }}>
					<button
						onClick={() => {
							setNotifOpen(!notifOpen);
							setProfileOpen(false);
						}}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							color: CREAM,
							padding: 4,
							position: "relative",
							display: "flex",
							alignItems: "center",
						}}
					>
						<BellIcon size={18} />
						<span
							style={{
								position: "absolute",
								top: 2,
								right: 2,
								width: 7,
								height: 7,
								borderRadius: "50%",
								background: RED,
							}}
						/>
					</button>
					{notifOpen && (
						<div
							style={{
								position: "absolute",
								right: -8,
								top: "calc(100% + 10px)",
								background: "rgba(10,9,8,0.97)",
								backdropFilter: "blur(20px)",
								border: `1px solid ${STONE_BORDER}`,
								borderRadius: 8,
								width: 300,
								padding: "8px 0",
								zIndex: 200,
								boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
							}}
						>
							{[
								{
									text: "New season: Seoul Nights S3",
									sub: "All episodes available now",
								},
								{
									text: "New episodes: Nexus Protocol",
									sub: "Episodes 4–6 just dropped",
								},
								{
									text: "Dynasty of Wolves is returning",
									sub: "Season 6 premieres Oct 14",
								},
								{
									text: "Recommended: The Signal",
									sub: "Based on what you watch",
								},
							].map((n, i) => (
								<div
									key={i}
									style={{
										padding: "10px 16px",
										cursor: "pointer",
										borderBottom:
											i < 3
												? `1px solid rgba(94,80,63,0.15)`
												: "none",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.background =
											"rgba(94,80,63,0.12)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.background = "transparent")
									}
								>
									<div
										style={{
											fontSize: 13,
											color: CREAM,
											fontFamily: "'Inter', sans-serif",
											marginBottom: 2,
										}}
									>
										{n.text}
									</div>
									<div
										style={{
											fontSize: 11,
											color: TAUPE,
											fontFamily: "'Inter', sans-serif",
										}}
									>
										{n.sub}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Profile */}
				<div style={{ position: "relative" }}>
					<button
						onClick={() => {
							setProfileOpen(!profileOpen);
							setNotifOpen(false);
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 6,
							background: "none",
							border: "none",
							cursor: "pointer",
						}}
					>
						<div
							style={{
								width: 30,
								height: 30,
								borderRadius: 4,
								background: WINE,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 15,
								fontWeight: 700,
								color: CREAM,
							}}
						>
							A
						</div>
						<ChevronDownIcon size={12} />
					</button>
					{profileOpen && (
						<div
							style={{
								position: "absolute",
								right: 0,
								top: "calc(100% + 10px)",
								background: "rgba(10,9,8,0.97)",
								backdropFilter: "blur(20px)",
								border: `1px solid ${STONE_BORDER}`,
								borderRadius: 8,
								width: 156,
								padding: "6px 0",
								zIndex: 200,
								boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
							}}
						>
							{["Profile", "Account", "Help Center", "Sign Out"].map(
								(item, i) => (
									<div
										key={i}
										style={{
											padding: "9px 16px",
											fontSize: 14,
											color: CREAM,
											fontFamily: "'Inter', sans-serif",
											cursor: "pointer",
											borderBottom:
												i === 2
													? `1px solid rgba(94,80,63,0.2)`
													: "none",
										}}
										onMouseEnter={(e) =>
											(e.currentTarget.style.background =
												"rgba(94,80,63,0.12)")
										}
										onMouseLeave={(e) =>
											(e.currentTarget.style.background =
												"transparent")
										}
									>
										{item}
									</div>
								),
							)}
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
	const [myList, setMyList] = useState<Set<number>>(new Set([1, 8]));
	const [selectedShow, setSelectedShow] = useState<Show | null>(null);
	const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
	const [genreOpen, setGenreOpen] = useState(false);
	const [muted, setMuted] = useState(true);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const featured = SHOWS[0];

	const toggleMyList = (id: number) => {
		setMyList((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleGenreSelect = (genre: string | null) => {
		setSelectedGenre(genre);
	};

	const handleGenreToggle = () => setGenreOpen((v) => !v);

	// Filter shows by search query or genre
	const filterShows = (shows: Show[]) => {
		let result = shows;
		if (selectedGenre && selectedGenre !== "All Genres") {
			result = result.filter((s) => matchGenre(s, selectedGenre));
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(s) =>
					s.title.toLowerCase().includes(q) ||
					s.genres.some((g) => g.toLowerCase().includes(q)) ||
					(s.cast || "").toLowerCase().includes(q) ||
					s.desc.toLowerCase().includes(q),
			);
		}
		return result;
	};

	// My list shows
	const myListShows = SHOWS.filter((s) => myList.has(s.id));

	return (
		<div
			style={{
				background: INK,
				minHeight: "100vh",
				color: CREAM,
				overflowX: "hidden",
			}}
		>
			<Navbar
				myListCount={myList.size}
				searchOpen={searchOpen}
				setSearchOpen={setSearchOpen}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
			/>

			{/* Hero */}
			<Hero
				show={featured}
				muted={muted}
				onToggleMute={() => setMuted((v) => !v)}
				inMyList={myList.has(featured.id)}
				onToggleMyList={toggleMyList}
				onOpen={setSelectedShow}
				selectedGenre={selectedGenre}
				onGenreToggle={handleGenreToggle}
				genreOpen={genreOpen}
			/>

			{/* Selected genre indicator */}
			{selectedGenre && selectedGenre !== "All Genres" && (
				<div
					style={{
						padding: "16px 48px 0",
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<span
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 14,
							color: TAUPE,
						}}
					>
						Filtering by:
					</span>
					<span
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 14,
							fontWeight: 700,
							color: CREAM,
							background: WINE_TINT,
							border: `1px solid ${STONE_BORDER}`,
							borderRadius: 4,
							padding: "3px 10px",
						}}
					>
						{selectedGenre}
					</span>
					<button
						onClick={() => {
							setSelectedGenre(null);
						}}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: TAUPE,
							textDecoration: "underline",
						}}
					>
						Clear
					</button>
				</div>
			)}

			{/* Search results banner */}
			{searchQuery.trim() && (
				<div style={{ padding: "20px 48px 0" }}>
					<h2
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 22,
							fontWeight: 700,
							color: CREAM,
							margin: 0,
						}}
					>
						Search results for "{searchQuery}"
					</h2>
				</div>
			)}

			{/* Content rows */}
			<div style={{ paddingTop: 32 }}>
				{/* Continue Watching — not filtered by genre */}
				{!searchQuery.trim() && (
					<ContinueWatchingRow
						items={WATCH_ITEMS}
						myList={myList}
						onToggleMyList={toggleMyList}
						onOpen={setSelectedShow}
					/>
				)}

				{/* Top 10 — not filtered */}
				{!searchQuery.trim() && !selectedGenre && (
					<Top10Row
						ids={TOP10}
						myList={myList}
						onToggleMyList={toggleMyList}
						onOpen={setSelectedShow}
					/>
				)}

				{/* Dynamic rows */}
				{ROWS.map((row) => {
					const shows = filterShows(getShows(row.ids));
					return (
						<ShowRow
							key={row.id}
							label={row.label}
							shows={shows}
							myList={myList}
							onToggleMyList={toggleMyList}
							onOpen={setSelectedShow}
							exploreAll={["new", "popular"].includes(row.id)}
						/>
					);
				})}

				{/* My List */}
				{!searchQuery.trim() && myListShows.length > 0 && (
					<ShowRow
						label="My List"
						shows={filterShows(myListShows)}
						myList={myList}
						onToggleMyList={toggleMyList}
						onOpen={setSelectedShow}
					/>
				)}
			</div>

			{/* Bottom padding */}
			<div style={{ height: 60 }} />

			{/* Preview Modal */}
			{selectedShow && (
				<PreviewModal
					show={selectedShow}
					inMyList={myList.has(selectedShow.id)}
					onToggleMyList={toggleMyList}
					onClose={() => setSelectedShow(null)}
					allShows={SHOWS}
				/>
			)}
		</div>
	);
}
