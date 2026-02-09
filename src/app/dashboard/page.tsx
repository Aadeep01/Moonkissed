"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, Moon, Stars, Sun, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DailyHoroscope } from "@/components/DailyHoroscope";
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
	const [charts, setCharts] = useState<ChartSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);

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

	return (
		<>
			<StarField />
			<main className="min-h-screen py-20 px-4">
				<div className="max-w-6xl mx-auto space-y-12">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
						<div className="space-y-2">
							<h1 className="text-5xl font-bold text-gradient">Cosmic Gallery</h1>
							<p className="text-white/60 text-lg">Your collection of celestial blueprints</p>
						</div>
						<Link href="/onboarding">
							<button
								type="button"
								className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-medium transition-all flex items-center gap-2 group"
							>
								Create New Chart
								<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</button>
						</Link>
					</div>

					{/* Daily Energy Section */}
					{!isLoading && charts.length > 0 && <DailyHoroscope sign={charts[0]?.sunSign || ""} />}

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
								<ChartCard key={chart._id} chart={chart} />
							))}
						</motion.div>
					)}
				</div>
			</main>
		</>
	);
}

function ChartCard({ chart }: { chart: ChartSummary }) {
	return (
		<Link href={`/chart/${chart._id}`}>
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
		</Link>
	);
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
