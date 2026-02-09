"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Loader2, MapPin, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarField } from "@/components/StarField";
import { cn } from "@/lib/utils";

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
		<>
			<StarField />
			<main className="min-h-screen flex items-center justify-center px-4 py-20">
				<div className="w-full max-w-xl">
					{/* Progress Indicator */}
					<div className="flex justify-between mb-12 relative px-2">
						<div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 -z-10" />
						{[1, 2, 3].map((s) => (
							<div
								key={s}
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
									step >= s
										? "bg-[rgb(var(--color-lavender))] glow text-white"
										: "bg-white/10 text-white/40",
								)}
							>
								{s}
							</div>
						))}
					</div>

					{/* Form Container */}
					<div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
						<AnimatePresence mode="wait">
							{step === 1 && (
								<motion.div
									key="step1"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="space-y-6"
								>
									<div className="space-y-2">
										<h2 className="text-3xl font-bold text-gradient">The Beginning</h2>
										<p className="text-white/60">
											Share your earthly details to begin your cosmic journey.
										</p>
									</div>

									<div className="space-y-4 pt-4">
										<div className="relative">
											<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
											<input
												type="text"
												placeholder="Full Name"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[rgb(var(--color-lavender))] transition-colors"
												value={formData.name}
												onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											/>
										</div>

										<div className="relative">
											<Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
											<input
												type="date"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[rgb(var(--color-lavender))] transition-colors appearance-none"
												value={formData.birthDate}
												onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
											/>
										</div>
									</div>

									<button
										type="button"
										onClick={nextStep}
										disabled={!formData.name || !formData.birthDate}
										className="w-full group relative py-4 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-50"
									>
										<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))]" />
										<span className="relative flex items-center justify-center gap-2">
											Continue{" "}
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</span>
									</button>
								</motion.div>
							)}

							{step === 2 && (
								<motion.div
									key="step2"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="space-y-6"
								>
									<div className="space-y-2">
										<h2 className="text-3xl font-bold text-gradient">The Moment</h2>
										<p className="text-white/60">
											Your exact birth time determines your Rising sign and house placements.
										</p>
									</div>

									<div className="space-y-4 pt-4">
										<div className="relative">
											<Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
											<input
												type="time"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[rgb(var(--color-lavender))] transition-colors"
												value={formData.birthTime}
												onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
											/>
										</div>
									</div>

									<div className="flex gap-4">
										<button
											type="button"
											onClick={prevStep}
											className="flex-1 py-4 text-lg font-semibold rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white/60"
										>
											Back
										</button>
										<button
											type="button"
											onClick={nextStep}
											disabled={!formData.birthTime}
											className="flex-[2] group relative py-4 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-50"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))]" />
											<span className="relative flex items-center justify-center gap-2">
												Nearly There{" "}
												<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
											</span>
										</button>
									</div>
								</motion.div>
							)}

							{step === 3 && (
								<motion.div
									key="step3"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									className="space-y-6"
								>
									<div className="space-y-2">
										<h2 className="text-3xl font-bold text-gradient">The Location</h2>
										<p className="text-white/60">
											Where the celestial bodies were aligned at the moment of your birth.
										</p>
									</div>

									<div className="space-y-4 pt-4 relative">
										<div className="relative">
											<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
											<input
												type="text"
												placeholder="City of Birth"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[rgb(var(--color-lavender))] transition-colors"
												value={formData.birthPlace}
												onChange={(e) => {
													setFormData({ ...formData, birthPlace: e.target.value });
													searchLocation(e.target.value);
												}}
											/>
											{isSearching && (
												<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 animate-spin" />
											)}
										</div>

										{/* Search Results Dropdown */}
										<AnimatePresence>
											{locations.length > 0 && !selectedLocation && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="absolute top-full left-0 w-full mt-2 glass rounded-2xl overflow-hidden z-50 shadow-2xl"
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
															className="w-full text-left px-6 py-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 text-sm"
														>
															{loc.display_name}
														</button>
													))}
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									<div className="flex gap-4">
										<button
											type="button"
											onClick={prevStep}
											className="flex-1 py-4 text-lg font-semibold rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white/60"
										>
											Back
										</button>
										<button
											type="button"
											onClick={handleSubmit}
											disabled={!selectedLocation || isSubmitting}
											className="flex-[2] group relative py-4 text-lg font-semibold rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-50"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))]" />
											<span className="relative flex items-center justify-center gap-2">
												{isSubmitting ? (
													<Loader2 className="w-5 h-5 animate-spin" />
												) : (
													<>
														Calibrate Chart{" "}
														<Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
													</>
												)}
											</span>
										</button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</main>
		</>
	);
}
