"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface Transit {
	transitingPlanet: string;
	natalPlanet: string;
	aspect: string;
	orb: number;
	transitingLongitude: number;
	natalLongitude: number;
}

interface TransitReportProps {
	natalPlanets: Array<{ name: string; longitude: number }>;
}

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

const PLANET_SYMBOLS: Record<string, string> = {
	Sun: "☉",
	Moon: "☽",
	Mercury: "☿",
	Venus: "♀",
	Mars: "♂",
	Jupiter: "♃",
	Saturn: "♄",
	Uranus: "♅",
	Neptune: "♆",
	Pluto: "♇",
};

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

const ASPECT_DESCRIPTIONS: Record<string, string> = {
	Conjunction: "Intensified energy - a powerful blending of planetary forces",
	Sextile: "Opportunity - harmonious flow supporting action",
	Square: "Challenge - tension requiring adjustment and growth",
	Trine: "Harmony - natural ease and flowing support",
	Opposition: "Balance - polarities seeking integration",
};

export function TransitReport({ natalPlanets }: TransitReportProps) {
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("12:00");
	const [transits, setTransits] = useState<Transit[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasCalculated, setHasCalculated] = useState(false);

	const calculateTransits = async () => {
		if (!selectedDate) return;

		setIsLoading(true);
		setHasCalculated(false);

		try {
			const dateTime = new Date(`${selectedDate}T${selectedTime}`);

			const response = await fetch("/api/transits", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					natalPlanets,
					targetDate: dateTime.toISOString(),
				}),
			});

			if (!response.ok) throw new Error("Failed to calculate transits");
			const data = await response.json();
			setTransits(data.transits || []);
			setHasCalculated(true);
		} catch (err) {
			console.error("Error calculating transits:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateStr: string, timeStr: string) => {
		if (!dateStr || !timeStr) return "";
		const date = new Date(`${dateStr}T${timeStr}`);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (timeStr: string) => {
		if (!timeStr) return "";
		const [hours, minutes] = timeStr.split(":");
		const date = new Date();
		date.setHours(Number.parseInt(hours || "0", 10), Number.parseInt(minutes || "0", 10));
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
							htmlFor="transit-date"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Calendar className="w-3.5 h-3.5" />
							Select Date
						</label>
						<input
							id="transit-date"
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="transit-time"
							className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2"
						>
							<Clock className="w-3.5 h-3.5" />
							Select Time (Optional)
						</label>
						<input
							id="transit-time"
							type="time"
							value={selectedTime}
							onChange={(e) => setSelectedTime(e.target.value)}
							className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))]/50 transition-all"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={calculateTransits}
					disabled={!selectedDate || isLoading}
					className="w-full group relative py-4 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-moonlight-gold))] to-[#d4b478] transition-all" />
					<span className="relative flex items-center justify-center gap-3 text-[#050810]">
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Calculating...
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
			{hasCalculated && !isLoading && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					{/* Date Header */}
					<div className="text-center pb-6 border-b border-white/10">
						<div className="text-xs uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))] mb-2">
							Cosmic Forecast For
						</div>
						<h3 className="text-2xl font-[family-name:var(--font-cormorant)] text-white">
							{formatDate(selectedDate, selectedTime)}
						</h3>
						<p className="text-white/40 text-sm mt-1">{formatTime(selectedTime)}</p>
					</div>

					{/* Transit List */}
					{transits.length > 0 ? (
						<div className="space-y-4">
							<div className="text-xs uppercase tracking-widest text-white/40">
								{transits.length} Active Transits
							</div>
							{transits.map((transit, index) => (
								<motion.div
									key={`${transit.transitingPlanet}-${transit.natalPlanet}-${transit.aspect}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
								>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<div className="flex items-center gap-1.5">
												<span
													className="text-xl"
													style={{ color: PLANET_COLORS[transit.transitingPlanet] || "#fff" }}
												>
													{PLANET_SYMBOLS[transit.transitingPlanet]}
												</span>
												<span className="text-sm text-white/60">{transit.transitingPlanet}</span>
											</div>
											<span className={`text-lg ${ASPECT_COLORS[transit.aspect]}`}>
												{ASPECT_ICONS[transit.aspect]}
											</span>
											<div className="flex items-center gap-1.5">
												<span
													className="text-xl"
													style={{ color: PLANET_COLORS[transit.natalPlanet] || "#fff" }}
												>
													{PLANET_SYMBOLS[transit.natalPlanet]}
												</span>
												<span className="text-sm text-white/60">Your {transit.natalPlanet}</span>
											</div>
										</div>
										<div className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40">
											Orb: {transit.orb.toFixed(1)}°
										</div>
									</div>
									<p className="text-sm text-white/50 leading-relaxed">
										{ASPECT_DESCRIPTIONS[transit.aspect]}
									</p>
								</motion.div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
							<p className="text-white/40">No major planetary transits on this date.</p>
							<p className="text-white/30 text-sm mt-2">The cosmic weather is quiet.</p>
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
}
