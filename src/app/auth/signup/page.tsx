"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarField } from "@/components/StarField";

export default function SignUpPage() {
	const [name, setName] = useState("");
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
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/auth/signin");
			} else {
				setError(data.error || "Failed to create account.");
			}
		} catch (_err) {
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<StarField />
			<main className="min-h-screen flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="glass max-w-md w-full p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-8"
				>
					<div className="text-center space-y-2">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--color-lavender))]/10 border border-[rgb(var(--color-lavender))]/20 text-[rgb(var(--color-lavender))] text-[10px] font-bold uppercase tracking-widest">
							<Sparkles className="w-3 h-3" /> New Journey
						</div>
						<h1 className="text-4xl font-bold text-gradient">Create Account</h1>
						<p className="text-white/40">Join the collective of cosmic seekers</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div className="space-y-1.5">
								<label
									htmlFor="name"
									className="text-xs font-bold uppercase tracking-wider text-white/60 ml-1"
								>
									Full Name
								</label>
								<input
									id="name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-lavender))]/50 transition-all"
									placeholder="Celestial Voyager"
								/>
							</div>
							<div className="space-y-1.5">
								<label
									htmlFor="email"
									className="text-xs font-bold uppercase tracking-wider text-white/60 ml-1"
								>
									Email Address
								</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-lavender))]/50 transition-all"
									placeholder="your@email.com"
								/>
							</div>
							<div className="space-y-1.5">
								<label
									htmlFor="password"
									className="text-xs font-bold uppercase tracking-wider text-white/60 ml-1"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-lavender))]/50 transition-all"
									placeholder="••••••••"
								/>
							</div>
						</div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-red-400 text-sm text-center font-medium"
							>
								{error}
							</motion.div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className="w-full relative group px-8 py-4 bg-gradient-to-r from-[rgb(var(--color-lavender))] to-[rgb(var(--color-celestial-pink))] rounded-2xl text-[rgb(var(--color-deep-space))] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
						>
							<div className="relative flex items-center justify-center gap-2">
								{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
							</div>
						</button>
					</form>

					<div className="text-center">
						<p className="text-white/40 text-sm">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="text-[rgb(var(--color-lavender))] hover:underline font-bold"
							>
								Sign In
							</Link>
						</p>
					</div>
				</motion.div>
			</main>
		</>
	);
}
