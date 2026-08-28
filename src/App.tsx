import { useState } from "react";
import LoginPage from "./modules/login/LoginPage";
import RegisterPage from "./modules/register/RegisterPage";
import Dashboard from "./modules/dashboard/Dashboard";
import WatchScreen from "./modules/movie/fixedscreen/movie";
import PreviewModal from "./modules/movie/PreviewModal";
import AccountPage from "./modules/account/AccountPage";
import ProfilePage from "./modules/profile/ProfilePage";
import HelpPage from "./modules/help/HelpPage";
import SubscriptionPage from "./modules/subscription/SubscriptionPage";
import type { Plan } from "./modules/subscription/SubscriptionPage";
import type { Show } from "./modules/movie/types";

type Page =
	| "login"
	| "register"
	| "dashboard"
	| "watch"
	| "account"
	| "profile"
	| "help"
	| "subscription";

export default function App() {
	const [page, setPage] = useState<Page>("login");
	const [watching, setWatching] = useState<Show | null>(null);
	const [previewing, setPreviewing] = useState<Show | null>(null);
	const [activePlan, setActivePlan] = useState<Plan | null>(() => {
		try { return JSON.parse(localStorage.getItem("sf_activePlan") ?? "null"); }
		catch { return null; }
	});
	const savePlan = (plan: Plan) => {
		setActivePlan(plan);
		localStorage.setItem("sf_activePlan", JSON.stringify(plan));
	};

	const goToWatch = (show: Show) => {
		setPreviewing(null); // close the modal if it was open
		setWatching(show);
		setPage("watch");
	};

	if (page === "watch" && watching) {
		return (
			<WatchScreen
				id={watching.id}
				title={watching.title}
				year={watching.year}
				rating={watching.rating}
				match={watching.match ?? 0}
				backgroundImage={watching.hero ?? watching.image}
				isSeries={watching.mediaType === "tv"}
				onBack={() => setPage("dashboard")}
			/>
		);
	}

	if (page === "dashboard") {
		return (
			<>
				<Dashboard
					onSignOut={() => setPage("login")}
					onWatch={goToWatch}
					onInfo={setPreviewing}
					onNavigate={(destination) => setPage(destination)}
				/>
				<PreviewModal
					show={previewing}
					onClose={() => setPreviewing(null)}
					onSelect={setPreviewing}
					onPlay={goToWatch}
				/>
			</>
		);
	}

	if (page === "account") {
		return (
			<AccountPage
				plan={activePlan}
				onPlanChange={savePlan}
				onBack={() => setPage("dashboard")}
				onNavigate={(destination) => setPage(destination)}
			/>
		);
	}

	if (page === "profile") {
		return (
			<ProfilePage
				onBack={() => setPage("dashboard")}
				onNavigate={(destination) => setPage(destination)}
			/>
		);
	}

	if (page === "help") {
		return (
			<HelpPage
				onBack={() => setPage("dashboard")}
				onNavigate={(destination) => setPage(destination)}
			/>
		);
	}

	if (page === "subscription") {
		return (
			<SubscriptionPage
				onSubscribe={savePlan}
				onComplete={() => setPage("dashboard")}
				onBack={() => setPage("login")}
			/>
		);
	}

	if (page === "register") {
		return <RegisterPage onNavigate={(p) => setPage(p)} />;
	}

	return <LoginPage onNavigate={(p) => setPage(p)} />;
}
