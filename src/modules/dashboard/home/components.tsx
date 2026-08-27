import { useMemo, useState } from "react";
import type { Show, TMDBCatalogData } from "../../movie/types";
import { CarouselRow, Footer, GenreFilters, Hero } from "../components";
import styles from "./home.module.css";

export interface CatalogViewProps {
	data: TMDBCatalogData;
	onWatch: (show: Show) => void;
	onInfo: (show: Show) => void;
}

export function CatalogView({ data, onWatch, onInfo }: CatalogViewProps) {
	const [genre, setGenre] = useState("All");

	const genres = useMemo(() => {
		const values = data.rows.flatMap((row) =>
			row.shows.flatMap((show) => show.genres),
		);
		return ["All", ...Array.from(new Set(values)).sort()].slice(0, 10);
	}, [data.rows]);

	const rows = useMemo(
		() =>
			data.rows
				.map((row) => ({
					...row,
					shows:
						genre === "All"
							? row.shows
							: row.shows.filter((show) => show.genres.includes(genre)),
				}))
				.filter((row) => row.shows.length > 0),
		[data.rows, genre],
	);

	return (
		<main>
			{data.loading && (
				<div className="flex min-h-[78vh] items-center justify-center">
					<p className={`text-sm animate-pulse ${styles.loadingText}`}>
						Loading TMDB titles…
					</p>
				</div>
			)}

			{data.error && !data.loading && (
				<div className="flex min-h-[78vh] flex-col items-center justify-center gap-3 px-6 text-center">
					<p className={`text-sm font-semibold ${styles.errorText}`}>
						{data.error}
					</p>
					<p className={`text-xs ${styles.errorHint}`}>
						Add your TMDB key to VITE_TMDB_API_KEY and try again.
					</p>
				</div>
			)}

			{!data.loading && !data.error && data.featured && (
				<>
					<Hero show={data.featured} onWatch={onWatch} onInfo={onInfo} />
					<GenreFilters
						active={genre}
						setActive={setGenre}
						genres={genres}
					/>
					<div className="flex flex-col gap-10 pb-4">
						{rows.map((row) => (
							<CarouselRow
								key={row.title}
								title={row.title}
								shows={row.shows}
								top10={row.top10}
								exploreAll={row.exploreAll}
								onPlay={onWatch}
								onInfo={onInfo}
							/>
						))}
					</div>
				</>
			)}

			<Footer />
		</main>
	);
}

export function HomeView(props: CatalogViewProps) {
	return <CatalogView {...props} />;
}
