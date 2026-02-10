"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Loader2, Moon, Sun, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CosmicSynthesisProps {
	sunSign: string;
	moonSign: string;
	risingSign: string;
	mercurySign: string;
	venusSign: string;
	marsSign: string;
	name: string;
}

interface SynthesisData {
	core_identity: string;
	emotional_world: string;
	mind_and_heart: string;
	destiny_path: string;
}

type TabKey = keyof SynthesisData;

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
	{ key: "core_identity", label: "Identity", icon: <Sun className="w-4 h-4" /> },
	{ key: "emotional_world", label: "Emotion", icon: <Moon className="w-4 h-4" /> },
	{ key: "mind_and_heart", label: "Love & Mind", icon: <Heart className="w-4 h-4" /> },
	{ key: "destiny_path", label: "Destiny", icon: <Zap className="w-4 h-4" /> },
];

export function CosmicSynthesis({
	sunSign,
	moonSign,
	risingSign,
	mercurySign,
	venusSign,
	marsSign,
	name,
}: CosmicSynthesisProps) {
	const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabKey>("core_identity");

	useEffect(() => {
		let isMounted = true;
		async function fetchSynthesis() {
			try {
				const response = await fetch("/api/synthesis", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						sunSign,
						moonSign,
						risingSign,
						mercurySign,
						venusSign,
						marsSign,
						name,
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to generate cosmic synthesis");
				}

				const data = await response.json();
				if (isMounted) setSynthesis(data.synthesis);
			} catch (err) {
				console.error("Synthesis error:", err);
				if (isMounted)
					setError("The cosmic energies are temporarily misaligned. Please try again.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		}

		fetchSynthesis();
		return () => {
			isMounted = false;
		};
	}, [sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign, name]);

	if (error) {
		return (
			<div className="glass rounded-3xl p-8 border-red-500/20 text-red-200/80 text-center italic">
				{error}
			</div>
		);
	}

	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="bg-[#1A1E29]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
				{/* Background Glow */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[rgb(var(--color-moonlight-gold))]/5 blur-[120px] rounded-full pointer-events-none" />

				{/* Header / Tabs */}
				<div className="relative z-10 border-b border-white/5">
					<div className="grid grid-cols-4">
						{TABS.map((tab) => {
							const isActive = activeTab === tab.key;
							return (
								<button
									type="button"
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									className={cn(
										"flex flex-col md:flex-row items-center justify-center gap-1.5 py-3 transition-all duration-300 text-[9px] md:text-xs font-bold uppercase tracking-widest relative group",
										isActive
											? "text-[rgb(var(--color-moonlight-gold))]"
											: "text-white/40 hover:text-white",
									)}
								>
									<span className="relative z-10 scale-90 md:scale-100">{tab.icon}</span>
									<span className="relative z-10 hidden md:inline">{tab.label}</span>
									<span className="relative z-10 md:hidden">{tab.label.split(" ")[0]}</span>

									{isActive && (
										<motion.div
											layoutId="activeTabIndicator"
											className="absolute bottom-0 w-full h-[2px] bg-[rgb(var(--color-moonlight-gold))] shadow-[0_0_10px_rgba(244,213,141,0.5)]"
											transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Content */}
				<div className="relative min-h-[320px] md:min-h-[380px] p-6 md:p-10 flex items-center justify-center">
					<AnimatePresence mode="wait">
						{isLoading ? (
							<motion.div
								key="loader"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-moonlight-gold))]"
							>
								<Loader2 className="w-6 h-6 animate-spin" />
								<span className="text-[10px] uppercase tracking-[0.2em] animate-pulse">
									Divining...
								</span>
							</motion.div>
						) : synthesis ? (
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="w-full max-w-2xl text-center"
							>
								<div className="mb-6">
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(var(--color-moonlight-gold))]/10 text-[rgb(var(--color-moonlight-gold))] mb-3 border border-[rgb(var(--color-moonlight-gold))]/20">
										{TABS.find((t) => t.key === activeTab)?.icon}
									</div>
									<h3 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-4xl text-[rgb(var(--color-cream-white))] leading-tight mb-3">
										{activeTab === "core_identity" && "The Soul's Signature"}
										{activeTab === "emotional_world" && "The Inner Tides"}
										{activeTab === "mind_and_heart" && "Thought & Affection"}
										{activeTab === "destiny_path" && "The Path Forward"}
									</h3>
									<div className="h-px w-16 bg-gradient-to-r from-transparent via-[rgb(var(--color-moonlight-gold))]/50 to-transparent mx-auto" />
								</div>

								<p className="font-[family-name:var(--font-cormorant)] text-lg md:text-xl leading-relaxed text-[rgb(var(--color-cream-white))]/85 font-light italic">
									"{synthesis[activeTab]}"
								</p>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
