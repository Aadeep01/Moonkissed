"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { CosmicBackground } from "@/components/CosmicBackground";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				router.push("/dashboard");
				router.refresh();
			}
		} catch (_err) {
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-[#050810] overflow-hidden relative">
			{/* Background - Visible everywhere but obscured on the right by the form panel */}
			<div className="absolute inset-0 z-0">
				<CosmicBackground />
			</div>

			{/* Left Side - Art & Quote (Desktop Only) */}
			<div className="hidden lg:flex flex-1 relative z-10 flex-col justify-center px-20 text-[rgb(var(--color-cream-white))]">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.2 }}
				>
					<h2 className="font-[family-name:var(--font-cormorant)] text-6xl leading-tight">
						The stars align <br />
						<span className="italic text-[rgb(var(--color-moonlight-gold))]">for you.</span>
					</h2>
					<div className="h-px w-20 bg-[rgb(var(--color-moonlight-gold))]/30 my-8" />
					<p className="font-[family-name:var(--font-inter)] text-lg opacity-60 font-light max-w-md leading-relaxed">
						"The cosmos is within us. We are made of star-stuff. We are a way for the universe to
						know itself."
					</p>
				</motion.div>
			</div>

			{/* Right Side - Form Panel */}
			<motion.div
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
				className="w-full lg:w-[45%] xl:w-[40%] bg-[rgb(var(--color-deep-space))]/60 backdrop-blur-2xl border-l border-white/5 relative z-20 flex flex-col justify-center p-8 md:p-16 lg:p-20 shadow-2xl"
			>
				<div className="max-w-sm mx-auto w-full space-y-10">
					<div className="space-y-4">
						<Link href="/">
							<h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[rgb(var(--color-cream-white))] tracking-wide hover:opacity-80 transition-opacity">
								Moonkissed
							</h1>
						</Link>
						<p className="font-[family-name:var(--font-inter)] text-[rgb(var(--color-cream-white))]/40 text-sm">
							Welcome back, voyager.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="space-y-6">
							<div className="group relative">
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="peer w-full bg-transparent border-b border-white/20 py-3 text-[rgb(var(--color-cream-white))] focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors font-[family-name:var(--font-inter)] placeholder-transparent"
									placeholder="Email"
								/>
								<label
									htmlFor="email"
									className="absolute left-0 -top-3.5 text-[rgb(var(--color-moonlight-gold))]/80 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[rgb(var(--color-moonlight-gold))] peer-focus:text-xs pointer-events-none"
								>
									Email Address
								</label>
							</div>
							<div className="group relative">
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="peer w-full bg-transparent border-b border-white/20 py-3 text-[rgb(var(--color-cream-white))] focus:outline-none focus:border-[rgb(var(--color-moonlight-gold))] transition-colors font-[family-name:var(--font-inter)] placeholder-transparent"
									placeholder="Password"
								/>
								<label
									htmlFor="password"
									className="absolute left-0 -top-3.5 text-[rgb(var(--color-moonlight-gold))]/80 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[rgb(var(--color-moonlight-gold))] peer-focus:text-xs pointer-events-none"
								>
									Password
								</label>
							</div>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-red-300/80 text-xs tracking-wide"
							>
								{error}
							</motion.div>
						)}

						<div className="pt-4">
							<button
								type="submit"
								disabled={isLoading}
								className="group flex items-center justify-between w-full py-4 border-b border-[rgb(var(--color-cream-white))]/20 hover:border-[rgb(var(--color-moonlight-gold))] transition-all duration-300"
							>
								<span className="font-[family-name:var(--font-cormorant)] text-xl text-[rgb(var(--color-cream-white))] group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors">
									{isLoading ? "Authenticating..." : "Enter Gallery"}
								</span>
								<div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[rgb(var(--color-moonlight-gold))] group-hover:border-transparent transition-all duration-300">
									{isLoading ? (
										<Loader2 className="w-4 h-4 animate-spin text-[rgb(var(--color-cream-white))]" />
									) : (
										<ArrowRight className="w-4 h-4 text-[rgb(var(--color-cream-white))] group-hover:text-[rgb(var(--color-deep-space))]" />
									)}
								</div>
							</button>
						</div>
					</form>

					<div className="pt-10">
						<p className="text-[rgb(var(--color-cream-white))]/40 text-xs font-[family-name:var(--font-inter)]">
							New journey?{" "}
							<Link
								href="/auth/signup"
								className="text-[rgb(var(--color-cream-white))] hover:text-[rgb(var(--color-moonlight-gold))] transition-colors ml-1 decoration-1 underline-offset-4 hover:underline"
							>
								Create an account
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
