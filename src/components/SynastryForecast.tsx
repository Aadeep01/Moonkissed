"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	Eye,
	Heart,
	Loader2,
	Sparkles,
} from "lucide-react";
import { useState } from "react";

interface SynastryForecastData {
	person1Name: string;
	person2Name: string;
	targetDate: string;
	synastryAspects: Array<{
		planet1: string;
		planet2: string;
		aspect: string;
		orb: number;
	}>;
	interpretation: {
		relationship_energy: string;
		how_person1_should_approach: string;
		how_person2_should_approach: string;
		karmic_indicators: string;
		potential_challenges: string;
		growth_opportunities: string;
		overall_verdict: string;
	};
}

const ASPECT_ICONS: Record<string, string> = {
	Conjunction: "☌",
	Sextile: "✱",
	Square: "□",
	Trine: "△",
	Opposition: "☍",
};

const ASPECT_COLORS: Record<string, string> = {
	Conjunction: "text-white",
	Sextile: "text-green-400",
	Square: "text-red-400",
	Trine: "text-green-400",
	Opposition: "text-red-400",
};

export function SynastryForecast({
	person1Chart,
	person2Chart,
}: {
	person1Chart: Record<string, unknown>;
	person2Chart: Record<string, unknown>;
}) {
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("12:00");
	const [result, setResult] = useState<SynastryForecastData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasCalculated, setHasCalculated] = useState(false);
	const [showTechnical, setShowTechnical] = useState(false);

	const calculateForecast = async () => {
		if (!selectedDate) return;

		setIsLoading(true);
		setHasCalculated(false);
		setResult(null);

		try {
			const dateTime = new Date(`${selectedDate}T${selectedTime}`);

			const response = await fetch("/api/synastry/forecast", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					person1Chart,
					person2Chart,
					targetDate: dateTime.toISOString(),
				}),
			});

			if (!response.ok) throw new Error("Failed to calculate forecast");
			const data = await response.json();
			setResult(data);
			setHasCalculated(true);
		} catch (err) {
			console.error("Error calculating synastry forecast:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-8">
			{/* Date & Time Selection */}
			<div className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label
							htmlFor="synastry-date"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Calendar className="w-3.5 h-3.5" />
							Select Date
						</label>
						<input
							id="synastry-date"
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="synastry-time"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Clock className="w-3.5 h-3.5" />
							Select Time
						</label>
						<input
							id="synastry-time"
							type="time"
							value={selectedTime}
							onChange={(e) => setSelectedTime(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={calculateForecast}
					disabled={!selectedDate || isLoading}
					className="w-full group relative py-4 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-celestial-pink))] to-[rgb(var(--color-lavender))] transition-all" />
					<span className="relative flex items-center justify-center gap-3 text-[#050810]">
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Reading the connection...
							</>
						) : (
							<>
								<Heart className="w-4 h-4" />
								Reveal Your Connection
							</>
						)}
					</span>
				</button>
			</div>

			{/* Results */}
			<AnimatePresence>
				{hasCalculated && result && !isLoading && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="space-y-8"
					>
						{/* Date Header */}
						<div className="text-center pb-6 border-b border-white/10">
							<div className="text-xs uppercase tracking-widest text-[rgb(var(--color-celestial-pink))] mb-2">
								Relationship Forecast For
							</div>
							<h3 className="text-2xl font-[family-name:var(--font-cormorant)] text-white">
								{formatDate(result.targetDate)}
							</h3>
						</div>

						{/* Relationship Energy */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="p-6 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-celestial-pink))]/10 to-transparent border border-[rgb(var(--color-celestial-pink))]/20"
						>
							<div className="flex items-center gap-3 mb-3">
								<Heart className="w-5 h-5 text-[rgb(var(--color-celestial-pink))]" />
								<h4 className="text-sm font-bold uppercase tracking-widest text-white">
									The Energy Between You
								</h4>
							</div>
							<p className="text-white/80 leading-relaxed">
								{result.interpretation.relationship_energy}
							</p>
						</motion.div>

						{/* How Each Person Should Approach */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
							>
								<div className="flex items-center gap-3 mb-3">
									<span className="text-2xl">🌟</span>
									<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-cream-white))]">
										{result.person1Name}
									</h4>
								</div>
								<p className="text-white/70 leading-relaxed text-sm">
									{result.interpretation.how_person1_should_approach}
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
							>
								<div className="flex items-center gap-3 mb-3">
									<span className="text-2xl">✨</span>
									<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-cream-white))]">
										{result.person2Name}
									</h4>
								</div>
								<p className="text-white/70 leading-relaxed text-sm">
									{result.interpretation.how_person2_should_approach}
								</p>
							</motion.div>
						</div>

						{/* Karmic Indicators */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="p-6 rounded-2xl bg-[rgb(var(--color-lavender))]/5 border border-[rgb(var(--color-lavender))]/20"
						>
							<div className="flex items-center gap-3 mb-3">
								<Sparkles className="w-5 h-5 text-[rgb(var(--color-lavender))]" />
								<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-lavender))]">
									Karmic Connection
								</h4>
							</div>
							<p className="text-white/70 leading-relaxed">
								{result.interpretation.karmic_indicators}
							</p>
						</motion.div>

						{/* Challenges & Growth */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
							>
								<h4 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-3">
									Watch Out For
								</h4>
								<p className="text-white/70 leading-relaxed text-sm">
									{result.interpretation.potential_challenges}
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
							>
								<h4 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-3">
									Growth Together
								</h4>
								<p className="text-white/70 leading-relaxed text-sm">
									{result.interpretation.growth_opportunities}
								</p>
							</motion.div>
						</div>

						{/* Overall Verdict */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="p-6 rounded-2xl bg-gradient-to-r from-[rgb(var(--color-moonlight-gold))]/10 to-transparent border border-[rgb(var(--color-moonlight-gold))]/20"
						>
							<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] mb-3">
								Final Thought
							</h4>
							<p className="text-white/80 leading-relaxed">
								{result.interpretation.overall_verdict}
							</p>
						</motion.div>

						{/* Toggle Technical Data */}
						<div className="pt-6 border-t border-white/10">
							<button
								type="button"
								onClick={() => setShowTechnical(!showTechnical)}
								className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
							>
								<Eye className="w-4 h-4" />
								{showTechnical ? "Hide Synastry Aspects" : "Show Synastry Aspects"}
								{showTechnical ? (
									<ChevronUp className="w-4 h-4" />
								) : (
									<ChevronDown className="w-4 h-4" />
								)}
							</button>

							<AnimatePresence>
								{showTechnical && result.synastryAspects.length > 0 && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-6 overflow-hidden"
									>
										<div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
											<div className="text-xs uppercase tracking-widest text-white/40 mb-3">
												Synastry Aspects
											</div>
											<div className="space-y-2">
												{result.synastryAspects.slice(0, 8).map((aspect) => (
													<div
														key={`${aspect.planet1}-${aspect.planet2}-${aspect.aspect}`}
														className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] text-sm"
													>
														<div className="flex items-center gap-2">
															<span
																className={`text-lg ${ASPECT_COLORS[aspect.aspect]}`}
																title={aspect.aspect}
															>
																{ASPECT_ICONS[aspect.aspect]}
															</span>
															<span className="text-white/60">
																{aspect.planet1} - {aspect.planet2}
															</span>
														</div>
														<span className="text-white/40 text-xs">{aspect.orb.toFixed(1)}°</span>
													</div>
												))}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
