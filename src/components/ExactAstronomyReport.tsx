"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Clock, Eye, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface PlanetData {
	name: string;
	symbol: string;
	longitude: number;
	latitude: number;
	distance: number;
	speed: number;
	isRetrograde: boolean;
	zodiacSign: string;
	zodiacDegree: number;
}

interface MoonPhaseData {
	phase: number;
	phaseName: string;
	illumination: number;
	age: number;
}

interface AstronomicalEvent {
	type: string;
	description: string;
	date: string;
}

interface AstronomyResult {
	date: string;
	planets: PlanetData[];
	moonPhase: MoonPhaseData;
	events: AstronomicalEvent[];
}

interface InterpretationData {
	energetic_tone: string;
	key_alignments: string;
	supported_actions: string;
	caution_areas: string;
	power_moment: string;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
	Aries: "♈︎",
	Taurus: "♉︎",
	Gemini: "♊︎",
	Cancer: "♋︎",
	Leo: "♌︎",
	Virgo: "♍︎",
	Libra: "♎︎",
	Scorpio: "♏︎",
	Sagittarius: "♐︎",
	Capricorn: "♑︎",
	Aquarius: "♒︎",
	Pisces: "♓︎",
};

const PLANET_COLORS: Record<string, string> = {
	Sun: "#fbbf24",
	Moon: "#60a5fa",
	Mercury: "#2dd4bf",
	Venus: "#f472b6",
	Mars: "#f87171",
	Jupiter: "#fbbf24",
	Saturn: "#94a3b8",
	Uranus: "#22d3ee",
	Neptune: "#818cf8",
	Pluto: "#a78bfa",
};

export function ExactAstronomyReport() {
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("12:00");
	const [result, setResult] = useState<AstronomyResult | null>(null);
	const [interpretation, setInterpretation] = useState<InterpretationData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isInterpreting, setIsInterpreting] = useState(false);
	const [hasCalculated, setHasCalculated] = useState(false);
	const [showTechnical, setShowTechnical] = useState(false);

	const calculateAstronomy = async () => {
		if (!selectedDate) return;

		setIsLoading(true);
		setHasCalculated(false);
		setInterpretation(null);

		try {
			const dateTime = new Date(`${selectedDate}T${selectedTime}`);

			// First get the astronomical data
			const astroResponse = await fetch("/api/astronomy", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					targetDate: dateTime.toISOString(),
				}),
			});

			if (!astroResponse.ok) throw new Error("Failed to calculate astronomy");
			const astroData = await astroResponse.json();
			setResult(astroData);

			// Then get the AI interpretation
			setIsInterpreting(true);
			const interpretResponse = await fetch("/api/astronomy/interpret", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					planets: astroData.planets,
					moonPhase: astroData.moonPhase,
					targetDate: dateTime.toISOString(),
				}),
			});

			if (interpretResponse.ok) {
				const interpretData = await interpretResponse.json();
				setInterpretation(interpretData.interpretation);
			}

			setHasCalculated(true);
		} catch (err) {
			console.error("Error:", err);
		} finally {
			setIsLoading(false);
			setIsInterpreting(false);
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

	const formatTime = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-8">
			{/* Date & Time Selection */}
			<div className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label
							htmlFor="astro-date"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Calendar className="w-3.5 h-3.5" />
							Select Date
						</label>
						<input
							id="astro-date"
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="astro-time"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Clock className="w-3.5 h-3.5" />
							Select Time
						</label>
						<input
							id="astro-time"
							type="time"
							value={selectedTime}
							onChange={(e) => setSelectedTime(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={calculateAstronomy}
					disabled={!selectedDate || isLoading}
					className="w-full group relative py-4 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-moonlight-gold))] to-[#d4b478] transition-all" />
					<span className="relative flex items-center justify-center gap-3 text-[#050810]">
						{isLoading || isInterpreting ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								{isInterpreting ? "Reading the cosmos..." : "Calculating..."}
							</>
						) : (
							<>
								<Sparkles className="w-4 h-4" />
								Reveal Cosmic Forecast
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
							<div className="text-xs uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] mb-2">
								Cosmic Forecast For
							</div>
							<h3 className="text-2xl font-[family-name:var(--font-cormorant)] text-white">
								{formatDate(result.date)}
							</h3>
							<p className="text-white/40 text-sm mt-1">{formatTime(result.date)} UTC</p>
						</div>

						{/* AI Interpretation */}
						{interpretation && (
							<div className="space-y-6">
								{/* Energetic Tone */}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="p-6 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-moonlight-gold))]/10 to-transparent border border-[rgb(var(--color-moonlight-gold))]/20"
								>
									<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] mb-3">
										The Energetic Tone
									</h4>
									<p className="text-white/80 leading-relaxed">{interpretation.energetic_tone}</p>
								</motion.div>

								{/* Key Alignments */}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
								>
									<h4 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-3">
										Key Cosmic Alignments
									</h4>
									<p className="text-white/70 leading-relaxed">{interpretation.key_alignments}</p>
								</motion.div>

								{/* Supported Actions & Caution */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3 }}
										className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20"
									>
										<h4 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-3">
											Cosmically Supported
										</h4>
										<p className="text-white/70 leading-relaxed text-sm">
											{interpretation.supported_actions}
										</p>
									</motion.div>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
									>
										<h4 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-3">
											Approach With Caution
										</h4>
										<p className="text-white/70 leading-relaxed text-sm">
											{interpretation.caution_areas}
										</p>
									</motion.div>
								</div>

								{/* Power Moment */}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="p-6 rounded-2xl bg-[rgb(var(--color-moonlight-gold))]/5 border border-[rgb(var(--color-moonlight-gold))]/20"
								>
									<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] mb-3">
										Power Moment Assessment
									</h4>
									<p className="text-white/80 leading-relaxed">{interpretation.power_moment}</p>
								</motion.div>
							</div>
						)}

						{/* Toggle Technical Data */}
						<div className="pt-6 border-t border-white/10">
							<button
								type="button"
								onClick={() => setShowTechnical(!showTechnical)}
								className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
							>
								<Eye className="w-4 h-4" />
								{showTechnical ? "Hide Technical Data" : "Show Technical Data"}
								{showTechnical ? (
									<ChevronUp className="w-4 h-4" />
								) : (
									<ChevronDown className="w-4 h-4" />
								)}
							</button>

							<AnimatePresence>
								{showTechnical && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-6 space-y-6 overflow-hidden"
									>
										{/* Moon Phase */}
										<div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
											<div className="text-xs uppercase tracking-widest text-white/40 mb-2">
												Moon Phase
											</div>
											<div className="text-white">
												{result.moonPhase.phaseName} • {result.moonPhase.illumination.toFixed(1)}%
												illuminated
											</div>
										</div>

										{/* Planet Positions */}
										<div className="space-y-2">
											<div className="text-xs uppercase tracking-widest text-white/40 mb-2">
												Planetary Positions
											</div>
											{result.planets.map((planet) => (
												<div
													key={planet.name}
													className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<span style={{ color: PLANET_COLORS[planet.name] || "#fff" }}>
																{planet.symbol}
															</span>
															<span className="text-white">{planet.name}</span>
															{planet.isRetrograde && (
																<span className="text-xs text-red-400">℞</span>
															)}
														</div>
														<div className="text-white/60">
															{ZODIAC_SYMBOLS[planet.zodiacSign]} {planet.zodiacDegree.toFixed(2)}°
														</div>
													</div>
												</div>
											))}
										</div>

										{/* Events */}
										{result.events.length > 0 && (
											<div className="space-y-2">
												<div className="text-xs uppercase tracking-widest text-white/40 mb-2">
													Events
												</div>
												{result.events.map((event) => (
													<div
														key={`${event.type}-${event.description}`}
														className="p-3 rounded-lg bg-[rgb(var(--color-moonlight-gold))]/5 border border-[rgb(var(--color-moonlight-gold))]/20 text-sm"
													>
														<span className="text-white/60">{event.type}:</span>{" "}
														<span className="text-white">{event.description}</span>
													</div>
												))}
											</div>
										)}
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
