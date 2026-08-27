import { useState, useEffect, useRef, useCallback } from "react";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
	bg: "#0A0908",
	wine: "#49111C",
	cream: "#F2F4F3",
	taupe: "#A9927D",
	border: "#5E503F",
};

// ── Plan data ─────────────────────────────────────────────────────────────────
type Plan = {
	id: string;
	PlanName: string;
	MonthlyPrice: string;
	PlanDescription: string;
	MaxUser: number;
	recommended?: boolean;
};

const PLANS: Plan[] = [
	{
		id: "basic",
		PlanName: "Basic",
		MonthlyPrice: "₱150",
		PlanDescription: "Simple streaming for one user.",
		MaxUser: 1,
	},
	{
		id: "standard",
		PlanName: "Standard",
		MonthlyPrice: "₱250",
		PlanDescription: "Flexible streaming for two users.",
		MaxUser: 2,
		recommended: true,
	},
	{
		id: "premium",
		PlanName: "Premium",
		MonthlyPrice: "₱400",
		PlanDescription: "More access for the whole household.",
		MaxUser: 4,
	},
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconUser({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 40 44"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="20" cy="13" r="9" />
			<path d="M2 42c0-9.94 8.06-18 18-18s18 8.06 18 18" />
		</svg>
	);
}

function IconUsers({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 56 44"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="20" cy="13" r="9" />
			<path d="M2 42c0-9.94 8.06-18 18-18s18 8.06 18 18" />
			<circle cx="42" cy="13" r="7" />
			<path d="M34 42c0-7.73 5.37-14.18 12.5-15.68" />
		</svg>
	);
}

function IconGroup({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 72 44"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="36" cy="12" r="9" />
			<path d="M18 42c0-9.94 8.06-18 18-18s18 8.06 18 18" />
			<circle cx="10" cy="14" r="7" />
			<path d="M2 42c0-7.73 5.37-14.18 12.5-15.68" />
			<circle cx="62" cy="14" r="7" />
			<path d="M70 42c0-7.73-5.37-14.18-12.5-15.68" />
		</svg>
	);
}

function IconMaxUser({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="7" r="4" />
			<path d="M3 21c0-5 4-9 9-9s9 4 9 9" />
		</svg>
	);
}

function IconChevronDown({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="3,6 8,11 13,6" />
		</svg>
	);
}

function IconCheck({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="2,8 6,13 14,3" />
		</svg>
	);
}

function IconX({ className = "" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		>
			<line x1="3" y1="3" x2="13" y2="13" />
			<line x1="13" y1="3" x2="3" y2="13" />
		</svg>
	);
}

// ── Plan card icon by id ──────────────────────────────────────────────────────
function PlanIcon({ id, className = "" }: { id: string; className?: string }) {
	if (id === "basic") return <IconUser className={className} />;
	if (id === "standard") return <IconUsers className={className} />;
	return <IconGroup className={className} />;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
	return (
		<div
			className="flex flex-col rounded-sm p-7 animate-pulse"
			style={{
				border: `1px solid ${C.border}`,
				background: C.bg,
				minHeight: 380,
			}}
		>
			<div
				className="mx-auto mb-5 h-12 w-12 rounded-full"
				style={{ background: C.border, opacity: 0.4 }}
			/>
			<div
				className="mx-auto mb-3 h-6 w-28 rounded"
				style={{ background: C.border, opacity: 0.4 }}
			/>
			<div
				className="mx-auto mb-1 h-10 w-20 rounded"
				style={{ background: C.border, opacity: 0.4 }}
			/>
			<div
				className="mx-auto mb-6 h-4 w-16 rounded"
				style={{ background: C.border, opacity: 0.3 }}
			/>
			<div
				className="mx-auto mb-6 h-4 w-40 rounded"
				style={{ background: C.border, opacity: 0.3 }}
			/>
			<div
				className="mt-auto h-px w-full"
				style={{ background: C.border, opacity: 0.4 }}
			/>
			<div
				className="mt-5 mb-6 mx-auto h-4 w-36 rounded"
				style={{ background: C.border, opacity: 0.3 }}
			/>
			<div
				className="h-11 w-full rounded-sm"
				style={{ background: C.border, opacity: 0.4 }}
			/>
		</div>
	);
}

// ── Confirmation modal ────────────────────────────────────────────────────────
function ConfirmModal({
	plan,
	onCancel,
	onContinue,
}: {
	plan: Plan;
	onCancel: () => void;
	onContinue: () => void;
}) {
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const cancelRef = useRef<HTMLButtonElement>(null);
	const firstFocusRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		firstFocusRef.current?.focus();
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onCancel]);

	// Trap focus
	useEffect(() => {
		const modal = document.getElementById("confirm-modal");
		if (!modal) return;
		const focusable = modal.querySelectorAll<HTMLElement>(
			'button, [href], input, [tabindex]:not([tabindex="-1"])',
		);
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const trap = (e: KeyboardEvent) => {
			if (e.key !== "Tab") return;
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		modal.addEventListener("keydown", trap);
		return () => modal.removeEventListener("keydown", trap);
	}, []);

	async function handleContinue() {
		setLoading(true);
		await new Promise((r) => setTimeout(r, 1200));
		setLoading(false);
		setDone(true);
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ background: "rgba(0,0,0,0.78)" }}
			onClick={(e) => {
				if (e.target === e.currentTarget) onCancel();
			}}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-heading"
			id="confirm-modal"
		>
			<div
				className="relative w-full max-w-md rounded-sm p-8"
				style={{
					background: "#100e0c",
					border: `1px solid ${C.border}`,
					boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
				}}
			>
				{/* X close */}
				<button
					ref={firstFocusRef}
					onClick={onCancel}
					className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-sm transition-colors"
					style={{ color: C.taupe }}
					aria-label="Close modal"
					onMouseEnter={(e) =>
						((e.currentTarget as HTMLElement).style.color = C.cream)
					}
					onMouseLeave={(e) =>
						((e.currentTarget as HTMLElement).style.color = C.taupe)
					}
				>
					<IconX className="h-4 w-4" />
				</button>

				{done ? (
					<div className="text-center py-4">
						<div
							className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
							style={{ background: C.wine }}
						>
							<IconCheck
								className="h-6 w-6"
								style={{ color: C.cream }}
							/>
						</div>
						<h2
							id="modal-heading"
							className="mb-2 text-2xl font-bold uppercase tracking-wide"
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								color: C.cream,
							}}
						>
							Plan Selected
						</h2>
						<p className="mb-6 text-sm" style={{ color: C.taupe }}>
							You selected the{" "}
							<span style={{ color: C.cream }}>{plan.PlanName}</span>{" "}
							plan.
						</p>
						<button
							onClick={onCancel}
							className="w-full py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors"
							style={{
								background: C.wine,
								color: C.cream,
								fontFamily: "'Inter', sans-serif",
							}}
							onMouseEnter={(e) =>
								((e.currentTarget as HTMLElement).style.background =
									"#5a1522")
							}
							onMouseLeave={(e) =>
								((e.currentTarget as HTMLElement).style.background =
									C.wine)
							}
						>
							Continue
						</button>
					</div>
				) : (
					<>
						<h2
							id="modal-heading"
							className="mb-1 text-2xl font-bold uppercase tracking-wide"
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								color: C.cream,
							}}
						>
							Confirm Your Plan
						</h2>
						<p className="mb-6 text-sm" style={{ color: C.taupe }}>
							You can review your selection before continuing.
						</p>

						<div
							className="mb-6 rounded-sm p-5"
							style={{
								border: `1px solid ${C.border}`,
								background: "#0d0b09",
							}}
						>
							<div className="flex justify-between mb-2">
								<span className="text-sm" style={{ color: C.taupe }}>
									Plan
								</span>
								<span
									className="text-sm font-semibold"
									style={{ color: C.cream }}
								>
									{plan.PlanName}
								</span>
							</div>
							<div className="flex justify-between mb-2">
								<span className="text-sm" style={{ color: C.taupe }}>
									Monthly Price
								</span>
								<span
									className="text-sm font-semibold"
									style={{ color: C.cream }}
								>
									{plan.MonthlyPrice}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm" style={{ color: C.taupe }}>
									Maximum Users
								</span>
								<span
									className="text-sm font-semibold"
									style={{ color: C.cream }}
								>
									{plan.MaxUser}
								</span>
							</div>
						</div>

						<div className="flex flex-col-reverse sm:flex-row gap-3">
							<button
								ref={cancelRef}
								onClick={onCancel}
								disabled={loading}
								className="flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors"
								style={{
									border: `1px solid ${C.border}`,
									color: C.cream,
									background: "transparent",
									fontFamily: "'Inter', sans-serif",
								}}
								onMouseEnter={(e) => {
									if (!loading)
										(
											e.currentTarget as HTMLElement
										).style.borderColor = C.taupe;
								}}
								onMouseLeave={(e) => {
									if (!loading)
										(
											e.currentTarget as HTMLElement
										).style.borderColor = C.border;
								}}
							>
								Cancel
							</button>
							<button
								onClick={handleContinue}
								disabled={loading}
								className="flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
								style={{
									background: loading ? "#3a0d15" : C.wine,
									color: C.cream,
									fontFamily: "'Inter', sans-serif",
								}}
								onMouseEnter={(e) => {
									if (!loading)
										(
											e.currentTarget as HTMLElement
										).style.background = "#5a1522";
								}}
								onMouseLeave={(e) => {
									if (!loading)
										(
											e.currentTarget as HTMLElement
										).style.background = loading ? "#3a0d15" : C.wine;
								}}
							>
								{loading && (
									<span
										className="h-4 w-4 rounded-full border-2 border-transparent animate-spin"
										style={{ borderTopColor: C.cream }}
									/>
								)}
								{loading
									? "Processing…"
									: `Continue with ${plan.PlanName}`}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

// ── Profile dropdown ──────────────────────────────────────────────────────────
const DROPDOWN_ITEMS = [
	{ label: "Profile", secondary: false },
	{ label: "Account", secondary: false },
	{ label: "Manage Profiles", secondary: false },
	{ label: "Help Center", secondary: false },
	{ label: "Back to StreamFlix", secondary: true },
	{ label: "Sign Out", secondary: true },
];

function ProfileDropdown({ onClose }: { onClose: () => void }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onClose]);

	return (
		<div
			ref={ref}
			className="absolute right-0 top-full mt-2 w-48 rounded-sm py-1 z-40"
			style={{
				background: "#100e0c",
				border: `1px solid rgba(94,80,63,0.5)`,
				boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
			}}
			role="menu"
		>
			{DROPDOWN_ITEMS.map((item) => (
				<button
					key={item.label}
					role="menuitem"
					className="w-full text-left px-4 py-2.5 text-sm transition-colors"
					style={{
						color: item.secondary ? C.taupe : C.cream,
						fontFamily: "'Inter', sans-serif",
						background: "transparent",
					}}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.background =
							`rgba(73,17,28,0.4)`;
						(e.currentTarget as HTMLElement).style.color = C.cream;
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.background =
							"transparent";
						(e.currentTarget as HTMLElement).style.color = item.secondary
							? C.taupe
							: C.cream;
					}}
					onClick={onClose}
				>
					{item.label}
				</button>
			))}
		</div>
	);
}

// ── Plan card ─────────────────────────────────────────────────────────────────
function PlanCard({
	plan,
	selected,
	onChoose,
	btnRef,
}: {
	plan: Plan;
	selected: boolean;
	onChoose: (plan: Plan) => void;
	btnRef: React.RefObject<HTMLButtonElement>;
}) {
	const isStandard = plan.recommended;
	const [hovered, setHovered] = useState(false);
	const [pressing, setPressing] = useState(false);
	const [flashing, setFlashing] = useState(false);
	const [ripples, setRipples] = useState<
		{ id: number; x: number; y: number }[]
	>([]);
	const rippleId = useRef(0);

	const cardBorderColor =
		selected || hovered ? C.wine : isStandard ? C.wine : C.border;
	const btnBg = isStandard ? C.wine : "transparent";
	const btnBorder = isStandard ? C.wine : C.border;

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const id = ++rippleId.current;
		setRipples((prev) => [...prev, { id, x, y }]);
		setTimeout(
			() => setRipples((prev) => prev.filter((r) => r.id !== id)),
			560,
		);
		setFlashing(true);
		setTimeout(() => setFlashing(false), 420);
		onChoose(plan);
	}

	return (
		<div
			className={`flex flex-col rounded-sm transition-all duration-200 relative h-full${flashing ? " card-flash" : ""}`}
			style={{
				border: `1.5px solid ${cardBorderColor}`,
				background: C.bg,
				boxShadow: flashing
					? undefined
					: selected
						? `0 0 0 1px ${C.wine}, 0 8px 32px rgba(73,17,28,0.25)`
						: isStandard
							? "0 4px 24px rgba(73,17,28,0.2)"
							: "none",
				transform: pressing ? "scale(0.992)" : "scale(1)",
				transition:
					"transform 0.1s ease, border-color 0.2s ease, box-shadow 0.2s ease",
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => {
				setHovered(false);
				setPressing(false);
			}}
		>
			{/* Recommended badge */}
			{plan.recommended && (
				<div className="absolute -top-px left-1/2 -translate-x-1/2">
					<span
						className="block px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-b-sm"
						style={{
							background: C.wine,
							color: C.cream,
							fontFamily: "'Barlow Condensed', sans-serif",
							letterSpacing: "0.15em",
						}}
					>
						Recommended
					</span>
				</div>
			)}

			{/* Selected indicator */}
			{selected && !plan.recommended && (
				<div className="absolute -top-px left-1/2 -translate-x-1/2">
					<span
						className="block px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-b-sm flex items-center gap-1"
						style={{
							background: C.wine,
							color: C.cream,
							fontFamily: "'Barlow Condensed', sans-serif",
							letterSpacing: "0.15em",
						}}
					>
						<IconCheck className="h-3 w-3" /> Selected
					</span>
				</div>
			)}

			<div className="flex flex-col items-center text-center px-7 pt-10 pb-7 flex-1 h-full">
				{/* Icon */}
				<PlanIcon
					id={plan.id}
					className="mb-4 h-12 w-12"
					style={{ color: C.taupe } as React.CSSProperties}
				/>

				{/* Plan name */}
				<h3
					className="text-2xl font-bold uppercase tracking-wider mb-3"
					style={{
						fontFamily: "'Barlow Condensed', sans-serif",
						color: C.cream,
						letterSpacing: "0.1em",
					}}
				>
					{plan.PlanName}
				</h3>

				{/* Price */}
				<div className="flex items-baseline gap-1.5 mb-4">
					<span
						className="text-5xl font-extrabold"
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							color: C.cream,
							lineHeight: 1,
						}}
					>
						{plan.MonthlyPrice}
					</span>
					<span
						className="text-sm"
						style={{ color: C.taupe, fontFamily: "'Inter', sans-serif" }}
					>
						/ month
					</span>
				</div>

				{/* Description */}
				<p
					className="text-sm mb-5 leading-relaxed"
					style={{ color: C.taupe, fontFamily: "'Inter', sans-serif" }}
				>
					{plan.PlanDescription}
				</p>

				{/* Divider */}
				<div
					className="w-full mb-5"
					style={{ height: 1, background: C.border, opacity: 0.6 }}
				/>

				{/* Max users */}
				<div className="flex items-center gap-2 mb-6">
					<IconMaxUser
						className="h-5 w-5 flex-shrink-0"
						style={{ color: C.taupe } as React.CSSProperties}
					/>
					<span
						className="text-sm"
						style={{ color: C.taupe, fontFamily: "'Inter', sans-serif" }}
					>
						Maximum Users: {plan.MaxUser}
					</span>
				</div>

				{/* Button */}
				<button
					ref={btnRef}
					onClick={handleClick}
					onMouseDown={() => setPressing(true)}
					onMouseUp={() => setPressing(false)}
					className="mt-auto w-full py-3 text-sm font-semibold uppercase tracking-wider rounded-sm focus-visible:outline-none overflow-hidden relative"
					style={{
						background: btnBg,
						border: `1.5px solid ${btnBorder}`,
						color: C.cream,
						fontFamily: "'Inter', sans-serif",
						letterSpacing: "0.05em",
						transition:
							"background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
						transform: pressing ? "scale(0.97)" : "scale(1)",
					}}
					aria-label={`Choose ${plan.PlanName} plan`}
					aria-pressed={selected}
					onMouseEnter={(e) => {
						(e.currentTarget as HTMLElement).style.background = "#5a1522";
						(e.currentTarget as HTMLElement).style.borderColor = C.wine;
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as HTMLElement).style.background = isStandard
							? C.wine
							: "transparent";
						(e.currentTarget as HTMLElement).style.borderColor =
							isStandard ? C.wine : C.border;
						setPressing(false);
					}}
					onFocus={(e) => {
						(e.currentTarget as HTMLElement).style.outline =
							`2px solid ${C.wine}`;
						(e.currentTarget as HTMLElement).style.outlineOffset = "3px";
					}}
					onBlur={(e) => {
						(e.currentTarget as HTMLElement).style.outline = "none";
					}}
				>
					{/* Ripples */}
					{ripples.map((r) => (
						<span
							key={r.id}
							className="ripple-circle"
							style={{ left: r.x, top: r.y }}
						/>
					))}
					Choose {plan.PlanName}
				</button>
			</div>
		</div>
	);
}

// ── Main App ──────────────────────────────────────────────────────────────────
type PageState = "loading" | "error" | "empty" | "ready";

export default function App() {
	const [pageState, setPageState] = useState<PageState>("loading");
	const [plans, setPlans] = useState<Plan[]>([]);
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [modalPlan, setModalPlan] = useState<Plan | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
	const btnRefs = useRef<Record<string, React.RefObject<HTMLButtonElement>>>(
		{},
	);

	PLANS.forEach((p) => {
		if (!btnRefs.current[p.id]) {
			btnRefs.current[p.id] = {
				current: null,
			} as React.RefObject<HTMLButtonElement>;
		}
	});

	// Simulate loading
	useEffect(() => {
		const t = setTimeout(() => {
			setPlans(PLANS);
			setPageState("ready");
		}, 900);
		return () => clearTimeout(t);
	}, []);

	// Global Escape for dropdown
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape" && dropdownOpen) {
				setDropdownOpen(false);
				dropdownTriggerRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [dropdownOpen]);

	function handleChoose(plan: Plan) {
		setSelectedPlan(plan);
		setModalPlan(plan);
	}

	function handleModalClose() {
		const prevPlan = modalPlan;
		setModalPlan(null);
		if (prevPlan) {
			setTimeout(() => btnRefs.current[prevPlan.id]?.current?.focus(), 50);
		}
	}

	const handleRetry = useCallback(() => {
		setPageState("loading");
		setTimeout(() => {
			setPlans(PLANS);
			setPageState("ready");
		}, 900);
	}, []);

	return (
		<div
			className="min-h-full flex flex-col"
			style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
		>
			{/* ── MAIN ── */}
			<main className="flex-1 mx-auto w-full max-w-5xl px-6 py-14 md:px-10">
				{/* Heading */}
				<header className="mb-12 text-center">
					<h1
						className="mb-3 font-extrabold uppercase leading-none"
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							color: C.cream,
							fontSize: "clamp(2.8rem, 6vw, 4.2rem)",
							letterSpacing: "0.04em",
						}}
					>
						Choose Your Plan
					</h1>
					<p className="text-base" style={{ color: C.taupe }}>
						Select the subscription plan that fits your streaming needs.
					</p>
				</header>

				{/* ── States ── */}
				{pageState === "loading" && (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
						<SkeletonCard />
						<SkeletonCard />
						<SkeletonCard />
					</div>
				)}

				{pageState === "error" && (
					<div className="flex flex-col items-center gap-4 py-20 text-center">
						<p
							className="text-lg font-semibold"
							style={{
								color: C.cream,
								fontFamily: "'Barlow Condensed', sans-serif",
							}}
						>
							We could not load the subscription plans.
						</p>
						<p className="text-sm" style={{ color: C.taupe }}>
							Please try again.
						</p>
						<button
							onClick={handleRetry}
							className="mt-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-sm"
							style={{ background: C.wine, color: C.cream }}
						>
							Try Again
						</button>
					</div>
				)}

				{pageState === "empty" && (
					<div className="flex flex-col items-center gap-4 py-20 text-center">
						<p
							className="text-lg font-semibold"
							style={{
								color: C.cream,
								fontFamily: "'Barlow Condensed', sans-serif",
							}}
						>
							Subscription plans are unavailable.
						</p>
						<p className="text-sm" style={{ color: C.taupe }}>
							Please try again later.
						</p>
						<button
							onClick={handleRetry}
							className="mt-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-sm"
							style={{ background: C.wine, color: C.cream }}
						>
							Try Again
						</button>
					</div>
				)}

				{pageState === "ready" && (
					<>
						{/* Cards */}
						<div
							className="grid gap-5 items-stretch"
							style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
							role="list"
							aria-label="Subscription plans"
						>
							{plans.map((plan) => (
								<PlanCard
									key={plan.id}
									plan={plan}
									selected={selectedPlan?.id === plan.id}
									onChoose={handleChoose}
									btnRef={
										btnRefs.current[
											plan.id
										] as React.RefObject<HTMLButtonElement>
									}
								/>
							))}
						</div>

						{/* Supporting message */}
						<p
							className="mt-10 text-center text-sm"
							style={{ color: C.taupe }}
						>
							You can change your plan later from your Account settings.
						</p>

						{/* Back link */}
						<div className="mt-4 text-center">
							<a
								href="#"
								className="text-sm underline underline-offset-2 transition-colors"
								style={{
									color: C.wine,
									fontFamily: "'Inter', sans-serif",
								}}
								onMouseEnter={(e) =>
									((e.currentTarget as HTMLElement).style.color =
										C.cream)
								}
								onMouseLeave={(e) =>
									((e.currentTarget as HTMLElement).style.color =
										C.wine)
								}
								onFocus={(e) =>
									((e.currentTarget as HTMLElement).style.outline =
										`2px solid ${C.wine}`)
								}
								onBlur={(e) =>
									((e.currentTarget as HTMLElement).style.outline =
										"none")
								}
								onClick={(e) => e.preventDefault()}
							>
								Back to StreamFlix
							</a>
						</div>
					</>
				)}
			</main>

			{/* ── Modal ── */}
			{modalPlan && (
				<ConfirmModal
					plan={modalPlan}
					onCancel={handleModalClose}
					onContinue={handleModalClose}
				/>
			)}
		</div>
	);
}
