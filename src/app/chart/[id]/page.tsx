import {
	ArrowUp,
	Calendar,
	Clock,
	Heart,
	MapPin,
	MessageSquare,
	Moon,
	Sparkles,
	Sun,
	Zap,
} from "lucide-react";
import { notFound } from "next/navigation";
import { BirthChartWheel } from "@/components/BirthChartWheel";
import { CosmicBackground } from "@/components/CosmicBackground";
import { CosmicSynthesis } from "@/components/CosmicSynthesis";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";
import { ChartPageHeader } from "./ChartPageHeader";

async function getChart(id: string) {
	await dbConnect();
	const chart = await BirthChart.findById(id).lean();
	if (!chart) return null;
	return JSON.parse(JSON.stringify(chart));
}

export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const chart = await getChart(id);

	if (!chart) {
		notFound();
	}

	const planetaryData = [
		{ name: "Sun", symbol: "☉", longitude: chart.sunLong, color: "#fbbf24" },
		{ name: "Moon", symbol: "☽", longitude: chart.moonLong, color: "#93c5fd" },
		{ name: "Mercury", symbol: "☿", longitude: chart.mercuryLong, color: "#2dd4bf" },
		{ name: "Venus", symbol: "♀", longitude: chart.venusLong, color: "#f472b6" },
		{ name: "Mars", symbol: "♂", longitude: chart.marsLong, color: "#f87171" },
	];

	return (
		<div className="min-h-screen bg-[#050810] text-[rgb(var(--color-cream-white))] selection:bg-[rgb(var(--color-moonlight-gold))]/30">
			<CosmicBackground />

			<main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-24 space-y-24">
				{/* Top Navigation */}
				<div className="flex justify-end mb-8">
					<ChartPageHeader />
				</div>

				{/* Dramatic Header */}
				<header className="text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgb(var(--color-moonlight-gold))]/30 bg-[rgb(var(--color-moonlight-gold))]/5 text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--color-moonlight-gold))]">
						<Sparkles className="w-3 h-3" /> Cosmic Blueprint
					</div>
					<h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl lg:text-8xl text-[rgb(var(--color-cream-white))]">
						{chart.name}
					</h1>

					<div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4">
						<div className="flex items-center gap-2 text-white/50 text-sm font-[family-name:var(--font-inter)] tracking-wider uppercase">
							<Calendar className="w-4 h-4" />
							<span>{new Date(chart.birthDate).toLocaleDateString()}</span>
						</div>
						<div className="w-px h-4 bg-white/10 hidden md:block" />
						<div className="flex items-center gap-2 text-white/50 text-sm font-[family-name:var(--font-inter)] tracking-wider uppercase">
							<Clock className="w-4 h-4" />
							<span>{chart.birthTime}</span>
						</div>
						<div className="w-px h-4 bg-white/10 hidden md:block" />
						<div className="flex items-center gap-2 text-white/50 text-sm font-[family-name:var(--font-inter)] tracking-wider uppercase">
							<MapPin className="w-4 h-4" />
							<span>{chart.birthPlace}</span>
						</div>
					</div>
				</header>

				{/* The Primal Triad (Big Three) */}
				<section className="space-y-12">
					<div className="text-center space-y-2">
						<h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[rgb(var(--color-cream-white))]">
							The Primal Triad
						</h2>
						<p className="text-white/40 text-sm tracking-wide font-[family-name:var(--font-inter)]">
							The three pillars of your cosmic identity
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<BigThreeCard
							sign={chart.sunSign}
							label="Sun Sign"
							sublabel="Core Identity"
							icon={<Sun className="w-8 h-8 text-amber-200" />}
							gradient="from-amber-500/10 to-transparent"
						/>
						<BigThreeCard
							sign={chart.moonSign}
							label="Moon Sign"
							sublabel="Emotional Soul"
							icon={<Moon className="w-8 h-8 text-blue-200" />}
							gradient="from-blue-500/10 to-transparent"
						/>
						<BigThreeCard
							sign={chart.risingSign}
							label="Rising Sign"
							sublabel="Mask to the World"
							icon={<ArrowUp className="w-8 h-8 text-purple-200" />}
							gradient="from-purple-500/10 to-transparent"
						/>
					</div>
				</section>

				{/* Chart Wheel & Synthesis */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
					{/* Wheel */}
					{chart.houses && chart.houses.length > 0 && (
						<div className="space-y-8 order-2 lg:order-1">
							<div className="text-center lg:text-left space-y-2">
								<h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[rgb(var(--color-cream-white))]">
									Natal Wheel
								</h2>
								<div className="h-px w-12 bg-[rgb(var(--color-moonlight-gold))]/50 mx-auto lg:mx-0" />
							</div>
							<div className="aspect-square w-full max-w-md mx-auto lg:mx-0 relative">
								<div className="absolute inset-0 bg-[rgb(var(--color-moonlight-gold))]/5 blur-[100px] rounded-full" />
								<BirthChartWheel
									planets={planetaryData}
									houses={chart.houses}
									ascendant={chart.ascendantLong}
								/>
							</div>
						</div>
					)}

					{/* Synthesis & Personal Planets */}
					<div className="space-y-16 order-1 lg:order-2">
						{/* Personal Planets */}
						<section className="space-y-8">
							<div className="space-y-2">
								<h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[rgb(var(--color-cream-white))]">
									Personal Alignments
								</h2>
								<p className="text-white/40 text-sm font-[family-name:var(--font-inter)]">
									The engines of your daily life
								</p>
							</div>
							<div className="grid grid-cols-1 gap-4">
								<div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors">
											<MessageSquare className="w-4 h-4 text-teal-200" />
										</div>
										<div>
											<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-cream-white))]">
												Mercury
											</h4>
											<span className="text-[10px] text-white/30 uppercase tracking-wider">
												Intellect & Communication
											</span>
										</div>
									</div>
									<div className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-cream-white))]">
										{chart.mercurySign}
									</div>
								</div>
								<div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors">
											<Heart className="w-4 h-4 text-pink-200" />
										</div>
										<div>
											<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-cream-white))]">
												Venus
											</h4>
											<span className="text-[10px] text-white/30 uppercase tracking-wider">
												Love & Values
											</span>
										</div>
									</div>
									<div className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-cream-white))]">
										{chart.venusSign}
									</div>
								</div>
								<div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[rgb(var(--color-moonlight-gold))] transition-colors">
											<Zap className="w-4 h-4 text-red-200" />
										</div>
										<div>
											<h4 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-cream-white))]">
												Mars
											</h4>
											<span className="text-[10px] text-white/30 uppercase tracking-wider">
												Action & Desire
											</span>
										</div>
									</div>
									<div className="font-[family-name:var(--font-cormorant)] text-2xl text-[rgb(var(--color-cream-white))]">
										{chart.marsSign}
									</div>
								</div>
							</div>
						</section>

						{/* AI Analysis */}
						<section className="space-y-8">
							<div className="space-y-2">
								<h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[rgb(var(--color-cream-white))]">
									Cosmic Synthesis
								</h2>
								<p className="text-white/40 text-sm font-[family-name:var(--font-inter)]">
									AI-powered interpretation of your soul
								</p>
							</div>
							<div className="glass rounded-[2rem] p-8 border border-white/5 relative bg-[#1A1E29]/40 backdrop-blur-md">
								<CosmicSynthesis
									sunSign={chart.sunSign}
									moonSign={chart.moonSign}
									risingSign={chart.risingSign}
									mercurySign={chart.mercurySign}
									venusSign={chart.venusSign}
									marsSign={chart.marsSign}
									name={chart.name}
								/>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}

interface BigThreeCardProps {
	icon: React.ReactNode;
	label: string;
	sublabel: string;
	sign: string;
	gradient: string;
}

function BigThreeCard({ icon, label, sublabel, sign, gradient }: BigThreeCardProps) {
	return (
		<div className="group relative overflow-hidden rounded-[2.5rem] bg-[#1A1E29]/30 border border-white/5 p-8 transition-all duration-500 hover:border-[rgb(var(--color-moonlight-gold))]/30 hover:bg-[#1A1E29]/50">
			<div
				className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}
			/>

			<div className="relative z-10 flex flex-col items-center text-center space-y-4">
				<div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
					{icon}
				</div>
				<div className="space-y-1">
					<span className="text-[10px] uppercase tracking-[0.2em] text-white/30 block">
						{sublabel}
					</span>
					<h3 className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--color-moonlight-gold))]">
						{label}
					</h3>
				</div>
				<p className="font-[family-name:var(--font-cormorant)] text-4xl lg:text-5xl text-[rgb(var(--color-cream-white))]">
					{sign}
				</p>
			</div>
		</div>
	);
}
