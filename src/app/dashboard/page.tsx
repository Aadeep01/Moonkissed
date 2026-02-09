"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, LogOut, Moon, Stars, Sun, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DailyHoroscope } from "@/components/DailyHoroscope";
import { MoonMonitor } from "@/components/MoonMonitor";
import { StarField } from "@/components/StarField";

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

	return (
		<>
			<StarField />
			<main className="min-h-screen py-20 px-4">
				<div className="max-w-6xl mx-auto space-y-12">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
						<div className="space-y-2">
							<h1 className="text-5xl font-bold text-gradient">Cosmic Gallery</h1>
							<p className="text-white/60 text-lg">
								{session?.user?.name ? `${session.user.name}'s collection` : "Your collection"} of
								celestial blueprints
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-4">
							<button
								type="button"
								onClick={() => signOut({ callbackUrl: "/auth/signin" })}
								className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2"
							>
								<LogOut className="w-4 h-4" /> Sign Out
							</button>
							<button
								type="button"
								onClick={() => {
									setCompareMode(!compareMode);
									setSelectedCharts([]);
								}}
								className={`px-6 py-4 rounded-2xl font-medium transition-all border ${
									compareMode
										? "bg-[rgb(var(--color-lavender))]/20 border-[rgb(var(--color-lavender))] text-white"
										: "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
								}`}
							>
								{compareMode ? "Cancel Compare" : "Compare Charts"}
							</button>
							<Link href="/onboarding">
								<button
									type="button"
									className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all flex items-center gap-2 group"
								>
									Create New
									<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</button>
							</Link>
						</div>
					</div>

					{/* Global Celestial State */}
					<MoonMonitor />

					{/* Synastry Banner */}
					{compareMode && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="glass rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-[rgb(var(--color-lavender))]/30 bg-[rgb(var(--color-lavender))]/5"
						>
							<div className="flex items-center gap-4">
								<div className="p-3 bg-[rgb(var(--color-lavender))]/20 rounded-full">
									<Stars className="w-6 h-6 text-[rgb(var(--color-lavender))]" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-white">Compare Two Souls</h3>
									<p className="text-white/40">Select two charts to analyze their compatibility</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-sm font-medium text-white/60">
									{selectedCharts.length} / 2 selected
								</span>
								<Link
									href={`/synastry/${selectedCharts[0]}/${selectedCharts[1]}`}
									className={`${
										selectedCharts.length === 2 ? "opacity-100" : "opacity-30 pointer-events-none"
									}`}
								>
									<button
										type="button"
										className="px-8 py-4 bg-[rgb(var(--color-lavender))] rounded-2xl text-[rgb(var(--color-deep-space))] font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(184,164,232,0.3)]"
									>
										Analyze Harmony
									</button>
								</Link>
							</div>
						</motion.div>
					)}

					{/* Daily Energy Section */}
					{!isLoading && charts.length > 0 && !compareMode && (
						<DailyHoroscope sign={charts[0]?.sunSign || ""} />
					)}

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5"
								/>
							))}
						</div>
					) : charts.length === 0 ? (
						<div className="text-center py-20 glass rounded-3xl border border-white/5 space-y-6">
							<div className="flex justify-center">
								<Stars className="w-16 h-16 text-white/20" />
							</div>
							<div className="space-y-2">
								<h2 className="text-2xl font-bold text-white">No blueprints found</h2>
								<p className="text-white/40">The stars are waiting to be mapped...</p>
							</div>
							<Link
								href="/onboarding"
								className="inline-block text-[rgb(var(--color-moonlight-gold))] hover:underline"
							>
								Begin your first journey
							</Link>
						</div>
					) : (
						<motion.div
							key={compareMode ? "compare" : "gallery"}
							initial="hidden"
							animate="show"
							variants={{
								hidden: { opacity: 0 },
								show: {
									opacity: 1,
									transition: { staggerChildren: 0.1 },
								},
							}}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{charts.map((chart) => (
								<button
									type="button"
									key={chart._id}
									onClick={() => compareMode && toggleChartSelection(chart._id)}
									className={`w-full text-left transition-all ${
										compareMode && selectedCharts.includes(chart._id)
											? "scale-[1.05] ring-2 ring-[rgb(var(--color-lavender))] rounded-3xl"
											: ""
									} ${!compareMode ? "cursor-default" : "cursor-pointer"}`}
								>
									<ChartCard chart={chart} isLink={!compareMode} />
								</button>
							))}
						</motion.div>
					)}
				</div>
			</main>
		</>
	);
}

function ChartCard({ chart, isLink = true }: { chart: ChartSummary; isLink?: boolean }) {
	const content = (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				show: { opacity: 1, y: 0 },
			}}
			className="group glass rounded-3xl p-6 space-y-6 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] border border-white/5 hover:border-white/20"
		>
			<div className="flex justify-between items-start">
				<div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[rgb(var(--color-lavender))]/20 transition-colors">
					<User className="w-6 h-6 text-[rgb(var(--color-lavender))]" />
				</div>
				<div className="flex items-center gap-1.5 text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
					<Calendar className="w-3 h-3" />
					{new Date(chart.createdAt).toLocaleDateString()}
				</div>
			</div>

			<div className="space-y-1">
				<h3 className="text-2xl font-bold text-white group-hover:text-gradient transition-all">
					{chart.name}
				</h3>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<SignItem
					icon={<Sun className="w-3 h-3 text-orange-400" />}
					sign={chart.sunSign}
					label="Sun"
				/>
				<SignItem
					icon={<Moon className="w-3 h-3 text-blue-300" />}
					sign={chart.moonSign}
					label="Moon"
				/>
				<SignItem
					icon={<Stars className="w-3 h-3 text-purple-400" />}
					sign={chart.risingSign}
					label="Rising"
				/>
			</div>
		</motion.div>
	);

	if (!isLink) return content;

	return <Link href={`/chart/${chart._id}`}>{content}</Link>;
}

function SignItem({ icon, sign, label }: { icon: React.ReactNode; sign: string; label: string }) {
	return (
		<div className="flex flex-col items-center p-2 rounded-xl bg-black/20 border border-white/5 space-y-1">
			<span className="text-[10px] uppercase tracking-tighter text-white/40">{label}</span>
			{icon}
			<span className="text-xs font-medium text-white/80 truncate w-full text-center">{sign}</span>
		</div>
	);
}
