"use client";

import { motion } from "framer-motion";

interface BirthChartWheelProps {
	planets: {
		name: string;
		symbol: string;
		longitude: number;
		color: string;
	}[];
	houses: number[];
	ascendant: number;
}

const ZODIAC_SIGNS = [
	{ name: "Aries", symbol: "♈︎" },
	{ name: "Taurus", symbol: "♉︎" },
	{ name: "Gemini", symbol: "♊︎" },
	{ name: "Cancer", symbol: "♋︎" },
	{ name: "Leo", symbol: "♌︎" },
	{ name: "Virgo", symbol: "♍︎" },
	{ name: "Libra", symbol: "♎︎" },
	{ name: "Scorpio", symbol: "♏︎" },
	{ name: "Sagittarius", symbol: "♐︎" },
	{ name: "Capricorn", symbol: "♑︎" },
	{ name: "Aquarius", symbol: "♒︎" },
	{ name: "Pisces", symbol: "♓︎" },
];

export function BirthChartWheel({
	planets = [],
	houses = [],
	ascendant = 0,
}: BirthChartWheelProps) {
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
		<div className="w-full max-w-2xl mx-auto aspect-square relative">
			<svg
				viewBox={`0 0 ${size} ${size}`}
				className="w-full h-full drop-shadow-[0_0_20px_rgba(184,164,232,0.1)]"
				role="img"
				aria-labelledby="chart-title"
			>
				<title id="chart-title">Astrological Birth Chart Wheel</title>
				{/* Background Glow */}
				<defs>
					<radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
						<stop offset="100%" stopColor="transparent" />
					</radialGradient>
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
								className="font-serif select-none"
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
							key={`house-${deg}-${i}`}
							x1={p1.x}
							y1={p1.y}
							x2={p2.x}
							y2={p2.y}
							stroke={i % 3 === 0 ? "rgba(255,221,153,0.3)" : "rgba(255,255,255,0.1)"}
							strokeWidth={i % 3 === 0 ? "2" : "1"}
						/>
					);
				})}

				{/* Planets */}
				{planets.map((planet) => {
					const pos = getCoords(planet.longitude, houseRadius);
					const lineEnd = getCoords(planet.longitude, zodiacRadius);

					return (
						<motion.g
							key={planet.name}
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.5, duration: 0.8 }}
							className="cursor-help"
						>
							<line
								x1={pos.x}
								y1={pos.y}
								x2={lineEnd.x}
								y2={lineEnd.y}
								stroke={planet.color}
								strokeWidth="1"
								strokeDasharray="2,2"
								opacity="0.3"
							/>
							<circle
								cx={pos.x}
								cy={pos.y}
								r="14"
								fill="rgba(20,20,25,0.95)"
								stroke={planet.color}
								strokeWidth="1"
							/>
							<text
								x={pos.x}
								y={pos.y}
								textAnchor="middle"
								dominantBaseline="middle"
								fill={planet.color}
								fontSize="14"
								className="font-serif select-none"
							>
								{planet.symbol}
							</text>
							<title>{`${planet.name}: ${planet.longitude.toFixed(1)}°`}</title>
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
		</div>
	);
}
