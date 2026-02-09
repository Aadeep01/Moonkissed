"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StarField } from "@/components/StarField";

interface SynastryResult {
	score: number;
	interpretation: string;
	strengths: string[];
	challenges: string[];
	person1: { name: string; sunSign: string };
	person2: { name: string; sunSign: string };
}

export default function SynastryPage() {
	const params = useParams();
	const id1 = params.id1 as string;
	const id2 = params.id2 as string;

	const [result, setResult] = useState<SynastryResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchSynastry() {
			try {
				const response = await fetch("/api/synastry", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ chartId1: id1, chartId2: id2 }),
				});

				if (response.ok) {
					const data = await response.json();
					setResult(data);
				} else {
					setError("The cosmic connection could not be established.");
				}
			} catch (err) {
				console.error("Synastry error:", err);
				setError("A celestial disturbance occurred.");
			} finally {
				setIsLoading(false);
			}
		}

		if (id1 && id2) fetchSynastry();
	}, [id1, id2]);

	return (
		<>
			<StarField />
			<main className="min-h-screen py-20 px-4">
				<div className="max-w-4xl mx-auto space-y-12">
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Gallery
					</Link>

					{isLoading ? (
						<div className="space-y-12 text-center py-20">
							<div className="relative inline-block">
								<Heart className="w-20 h-20 text-[rgb(var(--color-celestial-pink))] animate-pulse" />
								<div className="absolute inset-0 blur-2xl bg-[rgb(var(--color-celestial-pink))] opacity-30 animate-pulse" />
							</div>
							<div className="space-y-4">
								<h1 className="text-4xl font-bold text-white">Establishing Connection...</h1>
								<p className="text-white/40 animate-pulse">
									Calculating spiritual harmonics between two souls
								</p>
							</div>
						</div>
					) : error || !result ? (
						<div className="text-center py-20 glass rounded-3xl border border-white/10 space-y-4">
							<Zap className="w-12 h-12 text-red-400 mx-auto" />
							<p className="text-xl text-white/60">{error || "Connection failed."}</p>
						</div>
					) : (
						<div className="space-y-16">
							{/* Header / Score Section */}
							<div className="text-center space-y-8">
								<div className="space-y-2">
									<h1 className="text-5xl md:text-6xl font-bold text-gradient">
										{result.person1.name} & {result.person2.name}
									</h1>
									<p className="text-xl text-white/60">Celestial Compatibility Analysis</p>
								</div>

								<div className="relative inline-block group">
									<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
									<div className="relative glass p-12 rounded-full border border-white/20 aspect-square flex flex-col items-center justify-center space-y-1">
										<span className="text-6xl md:text-8xl font-black text-white">
											{result.score}%
										</span>
										<span className="text-[rgb(var(--color-moonlight-gold))] font-bold uppercase tracking-[0.2em] text-sm">
											Harmony
										</span>
									</div>
								</div>
							</div>

							{/* Interpretation Section */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="glass rounded-[3rem] p-10 md:p-16 space-y-10 border border-white/10 relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 p-12 opacity-10">
									<Sparkles className="w-24 h-24 text-[rgb(var(--color-moonlight-gold))]" />
								</div>

								<div className="space-y-6 relative">
									<h2 className="text-3xl font-bold text-white italic font-serif">
										The Spiritual Bond
									</h2>
									<div className="space-y-4">
										{result.interpretation.split("\n\n").map((para, i) => (
											<p
												key={i}
												className="text-xl text-white/80 leading-relaxed font-serif italic"
											>
												{para}
											</p>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/10">
									<div className="space-y-6">
										<div className="flex items-center gap-3 text-[rgb(var(--color-lavender))]">
											<div className="p-2 bg-[rgb(var(--color-lavender))]/10 rounded-lg">
												<Shield className="w-5 h-5" />
											</div>
											<h3 className="text-lg font-bold uppercase tracking-widest">
												Cosmic Strengths
											</h3>
										</div>
										<ul className="space-y-4">
											{result.strengths.map((s) => (
												<li key={s} className="flex gap-4 text-white/70">
													<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-lavender))] shrink-0" />
													<span>{s}</span>
												</li>
											))}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 text-red-400">
											<div className="p-2 bg-red-400/10 rounded-lg">
												<Zap className="w-5 h-5" />
											</div>
											<h3 className="text-lg font-bold uppercase tracking-widest">
												Celestial Hurdles
											</h3>
										</div>
										<ul className="space-y-4">
											{result.challenges.map((c) => (
												<li key={c} className="flex gap-4 text-white/70">
													<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
													<span>{c}</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</motion.div>

							{/* Call to action */}
							<div className="text-center">
								<p className="text-white/40 italic font-serif text-lg mb-8">
									"The meeting of two personalities is like the contact of two chemical substances:{" "}
									<br />
									if there is any reaction, both are transformed."
								</p>
							</div>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
