import { Calendar, Compass, MapPin, Moon, Sparkles, Stars, Sun } from "lucide-react";
import { notFound } from "next/navigation";
import { StarField } from "@/components/StarField";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

async function getChart(id: string) {
	await dbConnect();
	const chart = await BirthChart.findById(id).lean();
	if (!chart) return null;
	return JSON.parse(JSON.stringify(chart));
}

export default async function ChartPage({ params }: { params: { id: string } }) {
	const chart = await getChart(params.id);

	if (!chart) {
		notFound();
	}

	return (
		<>
			<StarField />
			<main className="min-h-screen py-20 px-4">
				<div className="max-w-6xl mx-auto space-y-12">
					{/* Header Info */}
					<div className="text-center space-y-4">
						<h1 className="text-5xl md:text-6xl font-bold text-gradient">
							{chart.name}'s Cosmic Blueprint
						</h1>
						<div className="flex flex-wrap justify-center gap-6 text-white/60">
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								{new Date(chart.birthDate).toLocaleDateString()}
							</div>
							<div className="flex items-center gap-2">
								<Compass className="w-4 h-4" />
								{chart.birthTime}
							</div>
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								{chart.birthPlace}
							</div>
						</div>
					</div>

					{/* The Big Three Section */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<SignCard
							title="Sun Sign"
							sign={chart.sunSign}
							description="Your core identity and vital life force."
							icon={<Sun className="w-12 h-12 text-orange-400" />}
						/>
						<SignCard
							title="Moon Sign"
							sign={chart.moonSign}
							description="Your emotional inner world and subconscious."
							icon={<Moon className="w-12 h-12 text-blue-300" />}
						/>
						<SignCard
							title="Rising Sign"
							sign={chart.risingSign}
							description="The mask you wear and how others perceive you."
							icon={<Stars className="w-12 h-12 text-purple-400" />}
						/>
					</div>

					{/* AI Insights Placeholder */}
					<div className="glass rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden group">
						<div className="absolute top-0 right-0 p-8">
							<Sparkles className="w-8 h-8 text-[rgb(var(--color-moonlight-gold))] animate-pulse" />
						</div>
						<div className="space-y-4 max-w-3xl">
							<h2 className="text-3xl font-bold text-[rgb(var(--color-cream-white))]">
								AI Cosmic Synthesis
							</h2>
							<p className="text-xl text-[rgb(var(--color-cream-white))]/70 leading-relaxed italic">
								"The alignment of {chart.sunSign} Sun and {chart.moonSign} Moon suggests a soul that
								balances deep intensity with profound emotional awareness. Your {chart.risingSign}{" "}
								Ascendant provides a magnetic presence that draws others toward your unique cosmic
								light..."
							</p>
							<div className="pt-4">
								<button
									type="button"
									className="px-8 py-3 glass hover:bg-white/20 transition-all rounded-full border border-white/20 flex items-center gap-2"
								>
									Unlock Full Reading <ArrowRight className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

interface SignCardProps {
	title: string;
	sign: string;
	description: string;
	icon: React.ReactNode;
}

function SignCard({ title, sign, description, icon }: SignCardProps) {
	return (
		<div className="glass rounded-3xl p-8 space-y-6 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(184,164,232,0.2)]">
			<div className="flex justify-between items-start">
				<div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
			</div>
			<div className="space-y-2">
				<h3 className="text-sm font-semibold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))]">
					{title}
				</h3>
				<p className="text-4xl font-bold text-[rgb(var(--color-cream-white))]">{sign}</p>
				<p className="text-[rgb(var(--color-cream-white))]/60 leading-relaxed">{description}</p>
			</div>
		</div>
	);
}

function ArrowRight({ className }: { className?: string }) {
	return (
		<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<title>Arrow Right</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M14 5l7 7m0 0l-7 7m7-7H3"
			/>
		</svg>
	);
}
