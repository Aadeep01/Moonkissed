"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { CosmicBackground } from "@/components/CosmicBackground";

export default function HomePage() {
	const { data: session } = useSession();
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});

	// Parallax effects
	// Hero stays mostly static, maybe subtle blur or parallax
	// Parallax effects
	const heroBlur = useTransform(scrollYProgress, [0, 1], ["0px", "5px"]);
	const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

	// Paper Sheet Animation
	// Slides up from the bottom (100% -> 0%)
	const sheetY = useTransform(scrollYProgress, [0, 1], ["100vh", "0vh"]);

	return (
		<div ref={containerRef} className="relative h-[150vh] bg-[rgb(var(--color-deep-space))]">
			<CosmicBackground />

			{/* Fixed Hero Section - Acts as the 'Background' Layer */}
			<motion.div
				style={{ filter: heroBlur, scale: heroScale }}
				className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
			>
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
						rotate: { duration: 90, repeat: Infinity, ease: "linear" },
					}}
					className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[rgb(var(--color-moonlight-gold))]/10 rounded-full -z-10"
				/>

				{/* Inner Accents - Dynamic Gyroscope - FIXED BORDERS */}
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
					{/* Main Title */}
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
						className="font-[family-name:var(--font-cormorant)] text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-[rgb(var(--color-cream-white))]"
					>
						Moonkissed
					</motion.h1>

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
								<span className="absolute inset-0 border border-[rgb(var(--color-moonlight-gold))]/30 rounded-full transition-all duration-500 group-hover:border-[rgb(var(--color-moonlight-gold))]/60" />
								<span className="relative font-[family-name:var(--font-inter)] text-xs md:text-sm font-medium tracking-widest uppercase text-[rgb(var(--color-cream-white))] group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors duration-300">
									{session ? "Enter Gallery" : "Begin Journey"}
								</span>
							</button>
						</Link>
					</motion.div>
				</div>

				{/* Scroll Indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.5 }}
					transition={{ delay: 1.5, duration: 1 }}
					className="absolute bottom-10 animate-bounce"
				>
					<span className="text-[rgb(var(--color-cream-white))] text-xs tracking-widest uppercase">
						Scroll
					</span>
				</motion.div>
			</motion.div>

			{/* The "Paper" Sheet Overlay - Sticky Reveal */}
			<motion.div className="absolute top-0 left-0 w-full min-h-screen z-20 flex items-center justify-center pointer-events-none sticky top-0">
				<motion.div
					style={{ y: sheetY }}
					className="w-full max-w-5xl bg-[rgb(var(--color-deep-space))]/95 backdrop-blur-xl border-t border-[rgb(var(--color-moonlight-gold))]/20 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] p-12 md:p-24 text-[rgb(var(--color-cream-white))] h-[90vh] pointer-events-auto flex flex-col justify-start overflow-y-auto"
				>
					<div className="max-w-3xl mx-auto text-center space-y-12">
						<div className="w-16 h-1 bg-[rgb(var(--color-moonlight-gold))]/30 mx-auto rounded-full mb-8" />

						<h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl font-light leading-none">
							The Blueprint of <br />
							<span className="italic text-[rgb(var(--color-moonlight-gold))]">Your Soul</span>
						</h2>

						<p className="font-[family-name:var(--font-inter)] text-lg opacity-80 leading-relaxed font-light">
							Moonkissed transcends traditional horoscopes. By fusing ancient astrological precision
							with advanced artificial intelligence, we decode the subtle language of the stars to
							offer you a mirror—clear, profound, and beautifully uniquely yours.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
							<div className="space-y-4">
								<h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-lavender))]">
									Hyper-Personal
								</h3>
								<p className="text-sm opacity-60 font-light">
									Every insight is calculated from your exact birth coordinates and time. No generic
									readings.
								</p>
							</div>
							<div className="space-y-4">
								<h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-lavender))]">
									AI Synthesis
								</h3>
								<p className="text-sm opacity-60 font-light">
									Our engine connects dots between planetary aspects that traditional charts often
									miss.
								</p>
							</div>
							<div className="space-y-4">
								<h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-lavender))]">
									Privacy First
								</h3>
								<p className="text-sm opacity-60 font-light">
									Your cosmic data is sacred. We encrypt everything and never sell your personal
									journey.
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
