"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	ChevronLeft,
	Clock,
	Loader2,
	MapPin,
	Sparkles,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CosmicBackground } from "@/components/CosmicBackground";

type Step = 1 | 2 | 3;

interface Location {
	display_name: string;
	lat: string;
	lon: string;
}

export default function OnboardingPage() {
	const router = useRouter();
	const [step, setStep] = useState<Step>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [locations, setLocations] = useState<Location[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		birthDate: "",
		birthTime: "",
		birthPlace: "",
	});

	const searchLocation = async (query: string) => {
		if (query.length < 3) return;
		setIsSearching(true);
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
			);
			const data = await res.json();
			setLocations(data);
		} catch (err) {
			console.error("Search error:", err);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSubmit = async () => {
		if (!selectedLocation) return;
		setIsSubmitting(true);
		try {
			const res = await fetch("/api/calculate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					latitude: parseFloat(selectedLocation.lat),
					longitude: parseFloat(selectedLocation.lon),
				}),
			});
			const data = await res.json();
			if (data.id) {
				router.push(`/chart/${data.id}`);
			}
		} catch (err) {
			console.error("Submission error:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
	const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

	return (
		<div className="min-h-screen bg-[#050810] text-[rgb(var(--color-cream-white))] relative overflow-hidden flex items-center justify-center">
			<CosmicBackground />

			<main className="relative z-10 w-full max-w-2xl px-6">
				{/* Step Indicator */}
				<div className="absolute top-10 left-0 w-full flex justify-center">
					<div className="flex items-center gap-2">
						{[1, 2, 3].map((s) => (
							<div
								key={s}
								className={`h-1 rounded-full transition-all duration-500 ${
									step >= s ? "w-8 bg-[rgb(var(--color-moonlight-gold))]" : "w-2 bg-white/10"
								}`}
							/>
						))}
					</div>
				</div>

				<div className="glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-white/5">
					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-12"
							>
								<div className="space-y-4 text-center">
									<span className="text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--color-moonlight-gold))]">
										Step 01 / 03
									</span>
									<h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[rgb(var(--color-cream-white))]">
										The First Breath
									</h2>
									<p className="text-[rgb(var(--color-cream-white))]/50 font-[family-name:var(--font-inter)] max-w-md mx-auto">
										Enter your earthly identity and the date your soul began its journey.
									</p>
								</div>

								<div className="space-y-8">
									<div className="group relative">
										<label
											htmlFor="name"
											className="text-xs uppercase tracking-widest text-white/30 ml-1 mb-2 block group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors"
										>
											Full Name
										</label>
										<div className="relative">
											<User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors" />
											<input
												id="name"
												type="text"
												placeholder="e.g. Atlas Nova"
												className="w-full bg-transparent border-b border-white/10 py-4 pl-10 pr-4 text-lg focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors placeholder:text-white/10"
												value={formData.name}
												onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											/>
										</div>
									</div>

									<div className="group relative">
										<label
											htmlFor="birthDate"
											className="text-xs uppercase tracking-widest text-white/30 ml-1 mb-2 block group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors"
										>
											Date of Birth
										</label>
										<div className="relative">
											<Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors" />
											<input
												id="birthDate"
												type="date"
												className="w-full bg-transparent border-b border-white/10 py-4 pl-10 pr-4 text-lg focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-20"
												value={formData.birthDate}
												onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
											/>
										</div>
									</div>
								</div>

								<button
									type="button"
									onClick={nextStep}
									disabled={!formData.name || !formData.birthDate}
									className="w-full group relative py-5 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(244,213,141,0.2)]"
								>
									<div className="absolute inset-0 bg-[rgb(var(--color-moonlight-gold))] transition-transform" />
									<span className="relative flex items-center justify-center gap-3 text-[#050810]">
										Continue Journey
										<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
									</span>
								</button>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-12"
							>
								<div className="space-y-4 text-center">
									<span className="text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--color-moonlight-gold))]">
										Step 02 / 03
									</span>
									<h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[rgb(var(--color-cream-white))]">
										The Precise Moment
									</h2>
									<p className="text-[rgb(var(--color-cream-white))]/50 font-[family-name:var(--font-inter)] max-w-md mx-auto">
										To map your Rising Sign and Houses, we need the exact time you arrived.
									</p>
								</div>

								<div className="space-y-8">
									<div className="group relative">
										<label
											htmlFor="birthTime"
											className="text-xs uppercase tracking-widest text-white/30 ml-1 mb-2 block group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors"
										>
											Time of Birth
										</label>
										<div className="relative">
											<Clock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors" />
											<input
												id="birthTime"
												type="time"
												className="w-full bg-transparent border-b border-white/10 py-4 pl-10 pr-4 text-2xl md:text-4xl font-[family-name:var(--font-cormorant)] focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-20 text-center"
												value={formData.birthTime}
												onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
											/>
										</div>
									</div>
								</div>

								<div className="flex gap-4">
									<button
										type="button"
										onClick={prevStep}
										className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
									>
										<ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
									</button>
									<button
										type="button"
										onClick={nextStep}
										disabled={!formData.birthTime}
										className="flex-1 group relative py-5 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50"
									>
										<div className="absolute inset-0 bg-[rgb(var(--color-moonlight-gold))] transition-transform" />
										<span className="relative flex items-center justify-center gap-3 text-[#050810]">
											Confirm Time
											<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										</span>
									</button>
								</div>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								key="step3"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-12"
							>
								<div className="space-y-4 text-center">
									<span className="text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--color-moonlight-gold))]">
										Step 03 / 03
									</span>
									<h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[rgb(var(--color-cream-white))]">
										The Sacred Ground
									</h2>
									<p className="text-[rgb(var(--color-cream-white))]/50 font-[family-name:var(--font-inter)] max-w-md mx-auto">
										The coordinates of your birth ground the chart to Earth.
									</p>
								</div>

								<div className="space-y-8 relative">
									<div className="group relative">
										<label
											htmlFor="birthPlace"
											className="text-xs uppercase tracking-widest text-white/30 ml-1 mb-2 block group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors"
										>
											City of Birth
										</label>
										<div className="relative">
											<MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[rgb(var(--color-moonlight-gold))] transition-colors" />
											<input
												id="birthPlace"
												type="text"
												placeholder="Search for a city..."
												className="w-full bg-transparent border-b border-white/10 py-4 pl-10 pr-4 text-lg focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors"
												value={formData.birthPlace}
												onChange={(e) => {
													setFormData({ ...formData, birthPlace: e.target.value });
													searchLocation(e.target.value);
												}}
											/>
											{isSearching && (
												<Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-moonlight-gold))] animate-spin" />
											)}
										</div>

										{/* Search Results */}
										<AnimatePresence>
											{locations.length > 0 && !selectedLocation && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: 10 }}
													className="absolute top-full left-0 w-full mt-4 bg-[#1A1E29] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl"
												>
													{locations.map((loc, index) => (
														<button
															key={`${loc.lat}-${loc.lon}-${index}`}
															type="button"
															onClick={() => {
																setSelectedLocation(loc);
																setFormData({ ...formData, birthPlace: loc.display_name });
																setLocations([]);
															}}
															className="w-full text-left px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-sm text-[rgb(var(--color-cream-white))]"
														>
															{loc.display_name}
														</button>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>

								<div className="flex gap-4 pt-8">
									<button
										type="button"
										onClick={prevStep}
										className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
									>
										<ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={!selectedLocation || isSubmitting}
										className="flex-1 group relative py-5 text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 disabled:opacity-50"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-moonlight-gold))] to-[#d4b478] transition-all" />
										<span className="relative flex items-center justify-center gap-3 text-[#050810]">
											{isSubmitting ? (
												<Loader2 className="w-5 h-5 animate-spin" />
											) : (
												<>
													Reveal Cosmic Chart
													<Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
												</>
											)}
										</span>
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</main>
		</div>
	);
}
