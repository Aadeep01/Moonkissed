"use client";

import { motion } from "framer-motion";
import { Heart, Moon, Sparkles, Stars } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { StarField } from "@/components/StarField";

export default function HomePage() {
	const { data: session } = useSession();

	return (
		<>
			<StarField />
			<main className="min-h-screen relative overflow-hidden">
				{/* Hero Section */}
				<section className="min-h-screen flex items-center justify-center px-4 py-20">
					<div className="max-w-5xl mx-auto text-center space-y-8">
						{/* Animated Moon Icon */}
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8 }}
							className="flex justify-center mb-8"
						>
							<div className="relative">
								<Moon className="w-20 h-20 text-[rgb(var(--color-moonlight-gold))] animate-pulse-slow" />
								<div className="absolute inset-0 blur-xl bg-[rgb(var(--color-moonlight-gold))] opacity-30 animate-pulse-slow" />
							</div>
						</motion.div>

						{/* Main Heading */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6"
						>
							<span className="text-gradient">Moonkissed</span>
						</motion.h1>

						{/* Tagline */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="text-xl md:text-2xl text-[rgb(var(--color-cream-white))]/80 max-w-2xl mx-auto"
						>
							Your cosmic blueprint, beautifully revealed
						</motion.p>

						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="pt-8 flex justify-center"
						>
							<Link href="/dashboard">
								<button
									type="button"
									className="group relative px-12 py-5 text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 min-w-[280px]"
								>
									{/* Gradient Background */}
									<div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))] transition-opacity group-hover:opacity-90" />

									{/* Shimmer Effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />

									{/* Button Text */}
									<span className="relative flex items-center justify-center gap-2 text-[rgb(var(--color-deep-space))]">
										<Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
										{session ? "Enter Your Gallery" : "Discover Your Chart"}
									</span>
								</button>
							</Link>
						</motion.div>

						{/* Feature Cards */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.8 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 max-w-4xl mx-auto"
						>
							{features.map((feature, index) => (
								<FeatureCard key={feature.title} feature={feature} index={index} />
							))}
						</motion.div>
					</div>
				</section>
			</main>
		</>
	);
}

interface Feature {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const features: Feature[] = [
	{
		icon: <Stars className="w-8 h-8" />,
		title: "AI-Powered Insights",
		description: "Deep celestial analysis powered by advanced AI technology",
	},
	{
		icon: <Moon className="w-8 h-8" />,
		title: "Birth Chart Analysis",
		description: "Discover your Sun, Moon, and Rising signs with precision",
	},
	{
		icon: <Heart className="w-8 h-8" />,
		title: "Compatibility",
		description: "Explore cosmic connections with those who matter most",
	},
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
			className="group glass rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(184,164,232,0.3)]"
		>
			<div className="text-[rgb(var(--color-lavender))] mb-4 group-hover:scale-110 transition-transform duration-300">
				{feature.icon}
			</div>
			<h3 className="text-xl font-semibold mb-2 text-[rgb(var(--color-cream-white))]">
				{feature.title}
			</h3>
			<p className="text-[rgb(var(--color-cream-white))]/70 text-sm leading-relaxed">
				{feature.description}
			</p>
		</motion.div>
	);
}
