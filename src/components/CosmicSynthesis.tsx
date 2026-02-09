"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface CosmicSynthesisProps {
	sunSign: string;
	moonSign: string;
	risingSign: string;
	name: string;
}

export function CosmicSynthesis({ sunSign, moonSign, risingSign, name }: CosmicSynthesisProps) {
	const [synthesis, setSynthesis] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchSynthesis() {
			try {
				const response = await fetch("/api/synthesis", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ sunSign, moonSign, risingSign, name }),
				});

				if (!response.ok) {
					throw new Error("Failed to generate cosmic synthesis");
				}

				const data = await response.json();
				setSynthesis(data.synthesis);
			} catch (err) {
				console.error("Synthesis error:", err);
				setError("The cosmic energies are temporarily misaligned. Please try again.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchSynthesis();
	}, [sunSign, moonSign, risingSign, name]);

	return (
		<div className="glass rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden group">
			<div className="absolute top-0 right-0 p-8">
				<Sparkles className="w-8 h-8 text-[rgb(var(--color-moonlight-gold))] animate-pulse" />
			</div>
			<div className="space-y-6 max-w-3xl">
				<h2 className="text-3xl font-bold text-[rgb(var(--color-cream-white))]">
					AI Cosmic Synthesis
				</h2>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center gap-4 text-[rgb(var(--color-cream-white))]/70"
					>
						<Loader2 className="w-6 h-6 animate-spin" />
						<p className="text-lg italic">Channeling the celestial wisdom...</p>
					</motion.div>
				)}

				{error && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-lg text-red-400/80 italic"
					>
						{error}
					</motion.p>
				)}

				{!isLoading && !error && synthesis && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-4"
					>
						{synthesis.split("\n\n").map((paragraph, index) => (
							<motion.p
								key={`${paragraph.substring(0, 30)}-${index}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.2, duration: 0.6 }}
								className="text-lg text-[rgb(var(--color-cream-white))]/80 leading-relaxed"
							>
								{paragraph}
							</motion.p>
						))}
					</motion.div>
				)}
			</div>
		</div>
	);
}
