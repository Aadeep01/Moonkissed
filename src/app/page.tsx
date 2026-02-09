"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CosmicBackground } from "@/components/CosmicBackground";

export default function HomePage() {
	const { data: session } = useSession();

	return (
		<>
			<CosmicBackground />
			<main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[rgb(var(--color-deep-space))]/20">
				{/* Outer Circle - Elegant Varying Orbit */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: 360,
					}}
					transition={{
						opacity: { duration: 1.5, ease: "easeOut" },
						scale: { duration: 1.5, ease: "easeOut" },
						rotate: { duration: 90, repeat: Infinity, ease: "linear" }, // Smooth constant base
					}}
					className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[rgb(var(--color-moonlight-gold))]/10 rounded-full -z-10"
				/>

				{/* Inner Accents - Dynamic Gyroscope */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: -360,
					}}
					transition={{
						opacity: { duration: 1.5, ease: "easeOut", delay: 0.2 },
						scale: { duration: 1.5, ease: "easeOut", delay: 0.2 },
						rotate: { duration: 120, repeat: Infinity, ease: "linear" },
					}}
					className="absolute w-[280px] h-[280px] md:w-[580px] md:h-[580px] rounded-full -z-10 border-t border-b border-[rgb(var(--color-moonlight-gold))]/20"
				/>

				<motion.div
					initial={{ opacity: 0, scale: 0.9, rotate: 45 }}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: -315,
					}}
					transition={{
						opacity: { duration: 1.5, ease: "easeOut", delay: 0.4 },
						scale: { duration: 1.5, ease: "easeOut", delay: 0.4 },
						rotate: { duration: 60, repeat: Infinity, ease: "linear" },
					}}
					className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full -z-10 border-l border-r border-[rgb(var(--color-moonlight-gold))]/30"
				/>

				<div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-12">
					{/* Main Title - Elegant & Serif */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
						className="font-[family-name:var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-[rgb(var(--color-cream-white))]"
					>
						Moonkissed
					</motion.h1>

					{/* Primary Action - Minimalist Button */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.8 }}
					>
						<Link href={session ? "/dashboard" : "/auth/signin"}>
							<button
								type="button"
								className="group relative px-10 py-4 overflow-hidden rounded-full transition-all duration-500 hover:bg-[rgb(var(--color-moonlight-gold))]/10"
							>
								{/* Thin Border */}
								<span className="absolute inset-0 border border-[rgb(var(--color-moonlight-gold))]/30 rounded-full transition-all duration-500 group-hover:border-[rgb(var(--color-moonlight-gold))]/60" />

								{/* Text */}
								<span className="relative font-[family-name:var(--font-inter)] text-xs md:text-sm font-medium tracking-widest uppercase text-[rgb(var(--color-cream-white))] group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors duration-300">
									{session ? "Enter Gallery" : "Begin Journey"}
								</span>
							</button>
						</Link>
					</motion.div>
				</div>

				{/* Footer/Scroll Hint */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 1.5 }}
					className="absolute bottom-12 text-center"
				>
					<p className="font-[family-name:var(--font-cormorant)] text-[rgb(var(--color-cream-white))]/30 text-sm italic">
						Precision Astrology &bull; Artificial Intelligence
					</p>
				</motion.div>
			</main>
		</>
	);
}
