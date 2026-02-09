"use client";

import { motion } from "framer-motion";
import { Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface MoonData {
	phaseDeg: number;
	phaseName: string;
	emoji: string;
	illumination: number;
	interpretation: string;
	nextFullMoon: string;
	nextNewMoon: string;
}

export function MoonMonitor() {
	const [data, setData] = useState<MoonData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchMoon() {
			try {
				const response = await fetch("/api/moon");
				if (response.ok) {
					const result = await response.json();
					setData(result.moon);
				}
			} catch (error) {
				console.error("Lunar fetch failed:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchMoon();
	}, []);

	if (isLoading) {
		return <div className="h-64 glass rounded-[2rem] animate-pulse bg-white/5" />;
	}

	if (!data) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass rounded-[2rem] p-8 md:p-12 border border-white/10 relative overflow-hidden group"
		>
			{/* Celestial Glow Background */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[rgb(var(--color-lavender))]/5 to-transparent pointer-events-none" />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
				{/* Visual Moon Section */}
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="relative">
						{/* Background Glow */}
						<div className="absolute inset-0 blur-3xl bg-[rgb(var(--color-lavender))] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

						{/* Real-feeling Moon Visualization */}
						<div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#1A1A2E] border border-white/5 shadow-inner overflow-hidden">
							{/* The Illumination Layer */}
							<div
								className="absolute inset-0 bg-[#E0E0FF] shadow-[0_0_40px_rgba(224,224,255,0.4)]"
								style={{
									clipPath:
										data.phaseDeg <= 180
											? `inset(0 ${100 - data.illumination * 100}% 0 0)`
											: `inset(0 0 0 ${100 - data.illumination * 100}%)`,
									opacity: 0.9,
								}}
							/>
							{/* Soft side of the moon edge shadow */}
							<div className="absolute inset-0 shadow-[inset_-20px_0_40px_rgba(0,0,0,0.8),inset_20px_0_40px_rgba(0,0,0,0.8)]" />
						</div>
					</div>

					<div className="text-center space-y-2">
						<h3 className="text-3xl font-bold text-white tracking-wide">{data.phaseName}</h3>
						<p className="text-[rgb(var(--color-lavender))] font-semibold uppercase tracking-[0.3em] text-xs">
							{(data.illumination * 100).toFixed(1)}% Illuminated
						</p>
					</div>
				</div>

				{/* Interpretation Section */}
				<div className="space-y-8">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/5 rounded-lg border border-white/10">
								<Sparkles className="w-5 h-5 text-[rgb(var(--color-moonlight-gold))]" />
							</div>
							<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))]">
								Lunar Wisdom
							</h4>
						</div>
						<p className="text-2xl font-serif italic text-white/90 leading-relaxed">
							"{data.interpretation}"
						</p>
					</div>

					{/* Upcoming Events */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<LunarEvent
							label="Next Full Moon"
							date={new Date(data.nextFullMoon).toLocaleDateString()}
							icon={<Moon className="w-4 h-4 text-white" />}
						/>
						<LunarEvent
							label="Next New Moon"
							date={new Date(data.nextNewMoon).toLocaleDateString()}
							icon={<Moon className="w-4 h-4 text-white/30" />}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function LunarEvent({ label, date, icon }: { label: string; date: string; icon: React.ReactNode }) {
	return (
		<div className="glass bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5 group-hover:border-white/10 transition-colors">
			<div className="p-2 bg-white/5 rounded-xl">{icon}</div>
			<div className="space-y-0.5">
				<p className="text-[10px] uppercase font-bold tracking-tighter text-white/40">{label}</p>
				<p className="text-sm font-medium text-white/80">{date}</p>
			</div>
		</div>
	);
}
