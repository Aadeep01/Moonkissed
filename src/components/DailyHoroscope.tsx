"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface DailyHoroscopeProps {
	sign: string;
}

export function DailyHoroscope({ sign }: DailyHoroscopeProps) {
	const [horoscope, setHoroscope] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchHoroscope() {
			try {
				const response = await fetch(`/api/horoscope/${sign}`);
				if (response.ok) {
					const data = await response.json();
					setHoroscope(data.horoscope);
				}
			} catch (error) {
				console.error("Failed to fetch horoscope:", error);
			} finally {
				setIsLoading(false);
			}
		}
		if (sign) fetchHoroscope();
	}, [sign]);

	if (!sign) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass rounded-3xl p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(244,213,141,0.05)] border border-[rgb(var(--color-moonlight-gold))]/10"
		>
			<div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
				<Sparkles className="w-12 h-12 text-[rgb(var(--color-moonlight-gold))]" />
			</div>

			<div className="max-w-2xl space-y-4">
				<div className="flex items-center gap-3">
					<div className="px-3 py-1 rounded-full bg-[rgb(var(--color-moonlight-gold))]/10 border border-[rgb(var(--color-moonlight-gold))]/20 text-[rgb(var(--color-moonlight-gold))] text-xs font-bold uppercase tracking-widest">
						Daily Energy
					</div>
					<h3 className="text-xl font-medium text-white/90">
						For the <span className="text-[rgb(var(--color-moonlight-gold))]">{sign}</span> Soul
					</h3>
				</div>

				{isLoading ? (
					<div className="space-y-2 animate-pulse">
						<div className="h-4 bg-white/5 rounded w-3/4" />
						<div className="h-4 bg-white/5 rounded w-1/2" />
					</div>
				) : (
					<p className="text-lg text-white/70 leading-relaxed italic font-serif">"{horoscope}"</p>
				)}
			</div>

			{/* Decorative background glow */}
			<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[rgb(var(--color-moonlight-gold))]/5 rounded-full blur-3xl" />
		</motion.div>
	);
}
