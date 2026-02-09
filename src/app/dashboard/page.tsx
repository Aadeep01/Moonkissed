"use client";

import { motion } from "framer-motion";
import { ArrowRight, LogOut, Moon, Plus, Search, Sparkles, Sun, User, X } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CosmicBackground } from "@/components/CosmicBackground";

import { MoonMonitor } from "@/components/MoonMonitor";

interface ChartSummary {
	_id: string;
	name: string;
	sunSign: string;
	moonSign: string;
	risingSign: string;
	createdAt: string;
}

export default function DashboardPage() {
	const { data: session } = useSession();
	const [charts, setCharts] = useState<ChartSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [compareMode, setCompareMode] = useState(false);
	const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		async function fetchCharts() {
			try {
				const response = await fetch("/api/charts");
				if (response.ok) {
					const data = await response.json();
					setCharts(data);
				}
			} catch (error) {
				console.error("Failed to fetch charts:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCharts();
	}, []);

	const toggleChartSelection = (id: string) => {
		setSelectedCharts((prev) => {
			if (prev.includes(id)) return prev.filter((i) => i !== id);
			if (prev.length < 2) return [...prev, id];
			return [prev[1] as string, id];
		});
	};

	const filteredCharts = charts.filter((chart) =>
		chart.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#050810] text-[rgb(var(--color-cream-white))] relative overflow-x-hidden selection:bg-[rgb(var(--color-moonlight-gold))]/30">
			<CosmicBackground />

			<main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-24 space-y-12">
				{/* Top Bar: Title & User Actions */}
				<header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-2">
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl text-[rgb(var(--color-cream-white))]"
						>
							Celestial Archives
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="font-[family-name:var(--font-inter)] text-sm text-white/50 tracking-wide"
						>
							Exploring the cosmos of {session?.user?.name?.split(" ")[0] || "voyager"}.
						</motion.p>
					</div>

					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setCompareMode(!compareMode)}
							className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
								compareMode
									? "bg-[rgb(var(--color-moonlight-gold))] text-[#050810] border-transparent"
									: "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
							}`}
						>
							{compareMode ? "Done" : "Compare"}
						</button>
						<button
							type="button"
							onClick={() => signOut({ callbackUrl: "/auth/signin" })}
							className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="Sign Out"
						>
							<LogOut className="w-4 h-4" />
						</button>
					</div>
				</header>

				{/* Planetary Status Bar */}
				{!compareMode && (
					<motion.section
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<MoonMonitor />
					</motion.section>
				)}

				{/* Compare Mode Visual Indicator */}
				<style jsx>{`
					.compare-bar-fixed {
						position: fixed;
						bottom: 2rem;
						left: 50%;
						transform: translateX(-50%);
						width: 90%;
						max-width: 600px;
						z-index: 50;
					}
				`}</style>
				{compareMode && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						className="compare-bar-fixed backdrop-blur-xl bg-[#0F1219]/90 border border-[rgb(var(--color-moonlight-gold))]/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4"
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-[rgb(var(--color-moonlight-gold))]/10 flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-[rgb(var(--color-moonlight-gold))]" />
							</div>
							<div className="flex flex-col">
								<span className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))]">
									Synastry
								</span>
								<span className="text-[10px] text-white/50">
									{selectedCharts.length} of 2 Selected
								</span>
							</div>
						</div>

						<Link
							href={
								selectedCharts.length === 2
									? `/synastry/${selectedCharts[0]}/${selectedCharts[1]}`
									: "#"
							}
							className={selectedCharts.length !== 2 ? "pointer-events-none opacity-50" : ""}
						>
							<button
								type="button"
								disabled={selectedCharts.length !== 2}
								className="px-6 py-3 bg-[rgb(var(--color-moonlight-gold))] text-[#050810] rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
							>
								Analyze <ArrowRight className="w-3 h-3" />
							</button>
						</Link>
					</motion.div>
				)}

				<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

				{/* Toolbar: Search */}
				<div className="flex items-center justify-between gap-4">
					<div className="relative group max-w-sm w-full">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors" />
						<input
							type="text"
							placeholder="Search charts..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-colors placeholder:text-white/20"
						/>
					</div>
					{/* Filter buttons could go here */}
				</div>

				{/* Main Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="aspect-[4/5] rounded-[2rem] bg-white/[0.02] border border-white/5 animate-pulse"
							/>
						))}
					</div>
				) : (
					<motion.div
						layout
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
					>
						{/* Empty State for Compare Mode or Search */}
						{filteredCharts.length === 0 && (compareMode || searchQuery) && (
							<div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
								<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
									<Search className="w-6 h-6 text-white/30" />
								</div>
								<div className="space-y-1">
									<h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-cream-white))]">
										{searchQuery ? "No charts found" : "No charts to compare"}
									</h3>
									<p className="text-sm text-white/40">
										{searchQuery
											? `No results for "${searchQuery}"`
											: "Create at least two charts to analyze compatibility."}
									</p>
								</div>
								{!searchQuery && (
									<button
										type="button"
										onClick={() => setCompareMode(false)}
										className="text-xs font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] hover:text-white transition-colors mt-4"
									>
										Return to Gallery
									</button>
								)}
							</div>
						)}

						{/* Card 1: Create New (Always first) */}
						{!compareMode && !searchQuery && (
							<Link href="/onboarding" className="group">
								<motion.div
									whileHover={{ y: -4 }}
									className="h-full min-h-[320px] rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[rgb(var(--color-moonlight-gold))]/40 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer p-6 text-center"
								>
									<div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[rgb(var(--color-moonlight-gold))] group-hover:text-[#050810] transition-colors duration-500">
										<Plus className="w-6 h-6" />
									</div>
									<div className="space-y-1">
										<h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-cream-white))]">
											New Chart
										</h3>
										<p className="text-xs text-white/40 font-[family-name:var(--font-inter)]">
											Map a new soul
										</p>
									</div>
								</motion.div>
							</Link>
						)}

						{/* Chart Cards */}
						{filteredCharts.map((chart) => (
							<ChartCard
								key={chart._id}
								chart={chart}
								compareMode={compareMode}
								isSelected={selectedCharts.includes(chart._id)}
								onSelect={() => toggleChartSelection(chart._id)}
							/>
						))}
					</motion.div>
				)}
			</main>
		</div>
	);
}

function ChartCard({
	chart,
	compareMode,
	isSelected,
	onSelect,
}: {
	chart: ChartSummary;
	compareMode: boolean;
	isSelected: boolean;
	onSelect: () => void;
}) {
	const content = (
		<div className="relative h-full min-h-[320px] bg-[#1A1E29]/40 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 flex flex-col justify-between group overflow-hidden transition-all duration-500 hover:border-[rgb(var(--color-moonlight-gold))]/30 hover:bg-[#1A1E29]/60">
			{/* Hover Glow Effect */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--color-moonlight-gold))]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

			{/* Header */}
			<div className="flex justify-between items-start relative z-10">
				<div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[rgb(var(--color-cream-white))]/60">
					<User className="w-4 h-4" />
				</div>
				<span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">NATAL</span>
			</div>

			{/* Center Info */}
			<div className="space-y-4 my-6 relative z-10">
				<h3 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[rgb(var(--color-cream-white))] leading-none group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors">
					{chart.name}
				</h3>
				<div className="h-px w-10 bg-[rgb(var(--color-moonlight-gold))]/30 group-hover:w-20 transition-all duration-500" />
			</div>

			{/* Footer: Signs */}
			<div className="grid grid-cols-3 gap-2 relative z-10">
				<SignPill
					icon={<Sun className="w-3 h-3 text-amber-200" />}
					label="Sun"
					sign={chart.sunSign}
				/>
				<SignPill
					icon={<Moon className="w-3 h-3 text-blue-200" />}
					label="Moon"
					sign={chart.moonSign}
				/>
				<SignPill
					icon={<ArrowRight className="w-3 h-3 text-purple-200" />}
					label="Asc"
					sign={chart.risingSign}
				/>
			</div>
		</div>
	);

	if (compareMode) {
		return (
			<motion.div
				layout
				onClick={onSelect}
				className={`relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 ${
					isSelected
						? "ring-2 ring-[rgb(var(--color-moonlight-gold))] scale-[0.98] bg-white/[0.08]"
						: "bg-white/[0.03] hover:bg-white/[0.05]"
				}`}
			>
				{isSelected && (
					<div className="absolute top-4 right-4 z-20 w-6 h-6 bg-[rgb(var(--color-moonlight-gold))] rounded-full flex items-center justify-center">
						<Sparkles className="w-3 h-3 text-[#050810]" />
					</div>
				)}
				{content}
			</motion.div>
		);
	}

	return (
		<Link href={`/chart/${chart._id}`} className="block group h-full">
			<motion.div layout whileHover={{ y: -6 }} className="h-full">
				{content}
			</motion.div>
		</Link>
	);
}

function SignPill({ icon, label, sign }: { icon: React.ReactNode; label: string; sign: string }) {
	return (
		<div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-black/20 border border-white/5 transition-colors group-hover:bg-black/30">
			<div className="flex items-center gap-1 opacity-50">
				{icon}
				<span className="text-[8px] uppercase tracking-wider">{label}</span>
			</div>
			<span className="text-xs font-medium text-[rgb(var(--color-cream-white))] truncate w-full text-center group-hover:text-white transition-colors">
				{sign}
			</span>
		</div>
	);
}
