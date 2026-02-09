"use client";

import { motion } from "framer-motion";
import { Calendar, Moon, Sparkles } from "lucide-react";
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
		return (
			<div className="h-40 rounded-[2rem] animate-pulse bg-white/[0.02] border border-white/5" />
		);
	}

	if (!data) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[rgb(var(--color-moonlight-gold))]/20 transition-all duration-500"
		>
			{/* Background Glow */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-[rgb(var(--color-moonlight-gold))]/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

			<div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
				{/* Moon Visual */}
				<div className="relative w-20 h-20 flex-shrink-0">
					<div className="absolute inset-0 bg-[rgb(var(--color-moonlight-gold))] blur-xl opacity-20" />
					<div className="relative w-full h-full rounded-full bg-[#1A1A2E] border border-white/10 overflow-hidden shadow-2xl">
						<div
							className="absolute inset-0 bg-[#E0E0FF] shadow-[0_0_20px_rgba(224,224,255,0.2)]"
							style={{
								clipPath:
									data.phaseDeg <= 180
										? `inset(0 ${100 - data.illumination * 100}% 0 0)`
										: `inset(0 0 0 ${100 - data.illumination * 100}%)`,
								opacity: 0.9,
							}}
						/>
						<div className="absolute inset-0 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5)]" />
					</div>
				</div>

				{/* Text Info */}
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<Sparkles className="w-3 h-3 text-[rgb(var(--color-moonlight-gold))]" />
						<span className="text-[10px] uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))]">
							Current Phase
						</span>
					</div>
					<h3 className="font-[family-name:var(--font-cormorant)] text-3xl text-[rgb(var(--color-cream-white))] leading-none">
						{data.phaseName}
					</h3>
					<p className="text-xs text-white/40 font-[family-name:var(--font-inter)]">
						{(data.illumination * 100).toFixed(0)}% Illumination
					</p>
				</div>
			</div>

			{/* Divider */}
			<div className="hidden md:block w-px h-16 bg-white/5" />

			{/* Wisdom */}
			<div className="flex-1 text-center md:text-left space-y-2 max-w-xl relative z-10">
				<p className="font-[family-name:var(--font-cormorant)] text-xl md:text-2xl italic text-[rgb(var(--color-cream-white))]/90 leading-relaxed">
					"{data.interpretation}"
				</p>
			</div>

			{/* Next Cycle */}
			<div className="hidden lg:flex items-center gap-8 relative z-10 pl-8 border-l border-white/5">
				<div className="flex flex-col items-center gap-1">
					<span className="text-[9px] uppercase tracking-widest text-white/30">Next Full</span>
					<div className="flex items-center gap-2 text-white/80">
						<Moon className="w-3 h-3 fill-current" />
						<span className="text-xs font-medium font-[family-name:var(--font-inter)]">
							{new Date(data.nextFullMoon).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
							})}
						</span>
					</div>
				</div>
				<div className="flex flex-col items-center gap-1">
					<span className="text-[9px] uppercase tracking-widest text-white/30">Next New</span>
					<div className="flex items-center gap-2 text-white/80">
						<div className="w-3 h-3 rounded-full border border-white/30" />
						<span className="text-xs font-medium font-[family-name:var(--font-inter)]">
							{new Date(data.nextNewMoon).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
							})}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
