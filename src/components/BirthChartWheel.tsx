"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

interface Planet {
	name: string;
	symbol: string;
	longitude: number;
	color: string;
}

interface BirthChartWheelProps {
	planets: Planet[];
	houses: number[];
	ascendant: number;
}

const ZODIAC_SIGNS = [
	{ name: "Aries", symbol: "♈︎", element: "Fire" },
	{ name: "Taurus", symbol: "♉︎", element: "Earth" },
	{ name: "Gemini", symbol: "♊︎", element: "Air" },
	{ name: "Cancer", symbol: "♋︎", element: "Water" },
	{ name: "Leo", symbol: "♌︎", element: "Fire" },
	{ name: "Virgo", symbol: "♍︎", element: "Earth" },
	{ name: "Libra", symbol: "♎︎", element: "Air" },
	{ name: "Scorpio", symbol: "♏︎", element: "Water" },
	{ name: "Sagittarius", symbol: "♐︎", element: "Fire" },
	{ name: "Capricorn", symbol: "♑︎", element: "Earth" },
	{ name: "Aquarius", symbol: "♒︎", element: "Air" },
	{ name: "Pisces", symbol: "♓︎", element: "Water" },
];

// Calculate aspects between planets
const calculateAspects = (planets: Planet[]) => {
	const aspects: { planet1: Planet; planet2: Planet; angle: number; type: string }[] = [];
	const aspectTypes = [
		{ name: "Conjunction", angle: 0, orb: 8 },
		{ name: "Sextile", angle: 60, orb: 6 },
		{ name: "Square", angle: 90, orb: 8 },
		{ name: "Trine", angle: 120, orb: 8 },
		{ name: "Opposition", angle: 180, orb: 8 },
	];

	for (let i = 0; i < planets.length; i++) {
		for (let j = i + 1; j < planets.length; j++) {
			const p1 = planets[i];
			const p2 = planets[j];
			if (!p1 || !p2) continue;
			let angle = Math.abs(p1.longitude - p2.longitude);
			if (angle > 180) angle = 360 - angle;

			for (const aspect of aspectTypes) {
				if (Math.abs(angle - aspect.angle) <= aspect.orb) {
					aspects.push({
						planet1: p1,
						planet2: p2,
						angle,
						type: aspect.name,
					});
					break;
				}
			}
		}
	}
	return aspects;
};

// Get zodiac sign for a longitude
const getZodiacSign = (longitude: number) => {
	const index = Math.floor(longitude / 30) % 12;
	return ZODIAC_SIGNS[index] ?? ZODIAC_SIGNS[0];
};

// Format degrees
const formatDegrees = (longitude: number) => {
	const sign = getZodiacSign(longitude);
	if (!sign) return "";
	const deg = Math.floor(longitude % 30);
	const min = Math.floor((longitude % 1) * 60);
	return `${deg}° ${sign.symbol} ${min}'`;
};

export function BirthChartWheel({
	planets = [],
	houses = [],
	ascendant = 0,
}: BirthChartWheelProps) {
	const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
	const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
	const [showAspects, setShowAspects] = useState(true);

	const aspects = calculateAspects(planets);
	const filteredAspects = selectedPlanet
		? aspects.filter((a) => a.planet1 === selectedPlanet || a.planet2 === selectedPlanet)
		: aspects;

	const size = 600;
	const center = size / 2;
	const radius = size * 0.45;
	const zodiacRadius = radius * 0.85;
	const houseRadius = radius * 0.7;
	const innerRadius = radius * 0.2;

	// Rotate the wheel so the Ascendant is at 180 degrees (left side)
	const rotationOffset = 180 - (ascendant || 0);

	const getCoords = (deg: number, r: number) => {
		const rad = ((deg + rotationOffset) * Math.PI) / 180;
		return {
			x: center + r * Math.cos(rad),
			y: center + r * Math.sin(rad),
		};
	};

	return (
		<div className="w-full max-w-2xl mx-auto">
			{/* Controls */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setShowAspects(!showAspects)}
						className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20"
					>
						{showAspects ? (
							<>
								<EyeOff className="w-3.5 h-3.5" />
								<span>Hide Lines</span>
							</>
						) : (
							<>
								<Eye className="w-3.5 h-3.5" />
								<span>Show Lines</span>
							</>
						)}
					</button>
				</div>
				<div className="text-white/40 text-xs">Click planets for details</div>
			</div>

			<div className="relative aspect-square">
				<svg
					viewBox={`0 0 ${size} ${size}`}
					className="w-full h-full drop-shadow-[0_0_20px_rgba(184,164,232,0.1)]"
					role="img"
					aria-labelledby="chart-title"
				>
					<title id="chart-title">Interactive Astrological Birth Chart Wheel</title>

					{/* Background Glow */}
					<defs>
						<radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
							<stop offset="100%" stopColor="transparent" />
						</radialGradient>
						<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="3" result="coloredBlur" />
							<feMerge>
								<feMergeNode in="coloredBlur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<circle cx={center} cy={center} r={radius} fill="url(#wheelGlow)" />

					{/* Zodiac Sections */}
					{ZODIAC_SIGNS.map((sign, i) => {
						const startDeg = i * 30;
						const midDeg = startDeg + 15;
						const endDeg = startDeg + 30;

						const p1 = getCoords(startDeg, radius);
						const p2 = getCoords(endDeg, radius);
						const p3 = getCoords(endDeg, zodiacRadius);
						const p4 = getCoords(startDeg, zodiacRadius);
						const labelPos = getCoords(midDeg, radius * 0.92);

						return (
							<g key={sign.name} className="group">
								<path
									d={`M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${zodiacRadius} ${zodiacRadius} 0 0 0 ${p4.x} ${p4.y} Z`}
									fill="transparent"
									stroke="rgba(255,255,255,0.15)"
									strokeWidth="1"
									className="group-hover:fill-white/5 transition-colors duration-500"
								/>
								<text
									x={labelPos.x}
									y={labelPos.y}
									textAnchor="middle"
									dominantBaseline="middle"
									fill="rgba(255,255,255,0.5)"
									fontSize="20"
									className="font-serif select-none group-hover:fill-white transition-colors duration-300"
									transform={`rotate(${midDeg + rotationOffset + 90}, ${labelPos.x}, ${labelPos.y})`}
								>
									{sign.symbol}
								</text>
							</g>
						);
					})}

					{/* House Dividers */}
					{houses.map((deg, i) => {
						const p1 = getCoords(deg, zodiacRadius);
						const p2 = getCoords(deg, innerRadius);
						return (
							<line
								key={`house-divider-${deg}`}
								x1={p1.x}
								y1={p1.y}
								x2={p2.x}
								y2={p2.y}
								stroke={i % 3 === 0 ? "rgba(255,221,153,0.3)" : "rgba(255,255,255,0.1)"}
								strokeWidth={i % 3 === 0 ? "2" : "1"}
							/>
						);
					})}

					{/* Aspect Lines */}
					<AnimatePresence>
						{showAspects &&
							filteredAspects.map((aspect) => {
								const p1 = getCoords(aspect.planet1.longitude, innerRadius * 0.8);
								const p2 = getCoords(aspect.planet2.longitude, innerRadius * 0.8);

								const strokeColor =
									aspect.type === "Conjunction"
										? "rgba(255,255,255,0.4)"
										: aspect.type === "Trine" || aspect.type === "Sextile"
											? "rgba(100,255,100,0.3)"
											: aspect.type === "Square" || aspect.type === "Opposition"
												? "rgba(255,100,100,0.3)"
												: "rgba(255,255,255,0.2)";

								return (
									<motion.line
										key={`aspect-${aspect.planet1.name}-${aspect.planet2.name}`}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										x1={p1.x}
										y1={p1.y}
										x2={p2.x}
										y2={p2.y}
										stroke={strokeColor}
										strokeWidth="1"
										strokeDasharray={aspect.type === "Opposition" ? "none" : "3,3"}
									/>
								);
							})}
					</AnimatePresence>

					{/* Planets */}
					{planets.map((planet) => {
						const pos = getCoords(planet.longitude, houseRadius);
						const lineEnd = getCoords(planet.longitude, zodiacRadius);
						const isSelected = selectedPlanet?.name === planet.name;
						const isHovered = hoveredPlanet?.name === planet.name;
						const isDimmed = selectedPlanet && !isSelected;

						return (
							<motion.g
								key={planet.name}
								initial={{ opacity: 0, scale: 0 }}
								animate={{
									opacity: isDimmed ? 0.3 : 1,
									scale: isSelected ? 1.3 : 1,
								}}
								transition={{ delay: 0.5, duration: 0.8 }}
								className="cursor-pointer"
								onClick={() => setSelectedPlanet(isSelected ? null : planet)}
								onMouseEnter={() => setHoveredPlanet(planet)}
								onMouseLeave={() => setHoveredPlanet(null)}
							>
								<line
									x1={pos.x}
									y1={pos.y}
									x2={lineEnd.x}
									y2={lineEnd.y}
									stroke={planet.color}
									strokeWidth="1"
									strokeDasharray="2,2"
									opacity={isDimmed ? 0.1 : 0.3}
								/>
								<circle
									cx={pos.x}
									cy={pos.y}
									r={isHovered || isSelected ? 18 : 14}
									fill="rgba(20,20,25,0.95)"
									stroke={planet.color}
									strokeWidth={isSelected ? 3 : 2}
									filter={isSelected || isHovered ? "url(#glow)" : undefined}
									className="transition-all duration-300"
								/>
								<text
									x={pos.x}
									y={pos.y}
									textAnchor="middle"
									dominantBaseline="middle"
									fill={planet.color}
									fontSize={isSelected ? 18 : 14}
									className="font-serif select-none pointer-events-none transition-all duration-300"
								>
									{planet.symbol}
								</text>
							</motion.g>
						);
					})}

					{/* Center Decorative Circle */}
					<circle
						cx={center}
						cy={center}
						r={innerRadius}
						fill="rgba(255,255,255,0.03)"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="1"
					/>
					<path
						d={`M ${center - 10} ${center} L ${center + 10} ${center} M ${center} ${center - 10} L ${center} ${center + 10}`}
						stroke="rgba(255,255,255,0.2)"
						strokeWidth="1"
					/>

					{/* Outer Border */}
					<circle
						cx={center}
						cy={center}
						r={radius}
						fill="none"
						stroke="rgba(255,255,255,0.2)"
						strokeWidth="2"
					/>
				</svg>

				{/* Planet Tooltip */}
				<AnimatePresence>
					{hoveredPlanet && !selectedPlanet && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute top-4 left-4 bg-[#1A1E29]/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 pointer-events-none z-10"
						>
							<div className="flex items-center gap-2">
								<span style={{ color: hoveredPlanet.color }} className="text-xl">
									{hoveredPlanet.symbol}
								</span>
								<div>
									<div className="text-white font-medium">{hoveredPlanet.name}</div>
									<div className="text-white/50 text-sm">
										{formatDegrees(hoveredPlanet.longitude)}
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Selected Planet Details Panel */}
			<AnimatePresence>
				{selectedPlanet && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						className="mt-6 bg-[#1A1E29]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
					>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<div
									className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
									style={{
										backgroundColor: `${selectedPlanet.color}20`,
										border: `2px solid ${selectedPlanet.color}`,
										color: selectedPlanet.color,
									}}
								>
									{selectedPlanet.symbol}
								</div>
								<div>
									<h3 className="text-xl font-[family-name:var(--font-cormorant)] text-white">
										{selectedPlanet.name}
									</h3>
									<p className="text-white/50 text-sm">{formatDegrees(selectedPlanet.longitude)}</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setSelectedPlanet(null)}
								className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
								aria-label="Close"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Aspects for selected planet */}
						{filteredAspects.length > 0 && (
							<div className="mt-4 pt-4 border-t border-white/10">
								<h4 className="text-xs uppercase tracking-widest text-white/40 mb-3">Aspects</h4>
								<div className="flex flex-wrap gap-2">
									{filteredAspects.map((aspect, _i) => {
										const otherPlanet =
											aspect.planet1 === selectedPlanet ? aspect.planet2 : aspect.planet1;
										const aspectColor =
											aspect.type === "Trine" || aspect.type === "Sextile"
												? "text-green-400"
												: aspect.type === "Square" || aspect.type === "Opposition"
													? "text-red-400"
													: "text-white/60";
										return (
											<div
												key={`${aspect.planet1.name}-${aspect.planet2.name}-${aspect.type}`}
												className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 text-sm"
											>
												<span style={{ color: otherPlanet.color }}>{otherPlanet.symbol}</span>
												<span className="text-white/60">{otherPlanet.name}</span>
												<span className={aspectColor}>{aspect.type}</span>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
