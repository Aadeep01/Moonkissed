import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_KEY,
});

interface PlanetData {
	name: string;
	longitude: number;
	zodiacSign: string;
	zodiacDegree: number;
	isRetrograde: boolean;
	speed: number;
}

interface Aspect {
	planet1: string;
	planet2: string;
	aspect: string;
	orb: number;
}

const ASPECT_TYPES = [
	{ name: "Conjunction", angle: 0, orb: 8, meaning: "Blending of energies" },
	{ name: "Sextile", angle: 60, orb: 6, meaning: "Harmonious opportunity" },
	{ name: "Square", angle: 90, orb: 8, meaning: "Tension requiring adjustment" },
	{ name: "Trine", angle: 120, orb: 8, meaning: "Natural flow" },
	{ name: "Opposition", angle: 180, orb: 8, meaning: "Polarities seeking integration" },
];

function calculateAspect(p1Lon: number, p2Lon: number): Aspect | null {
	let diff = Math.abs(p1Lon - p2Lon);
	if (diff > 180) diff = 360 - diff;

	for (const asp of ASPECT_TYPES) {
		const orb = Math.abs(diff - asp.angle);
		if (orb <= asp.orb) {
			return { planet1: "", planet2: "", aspect: asp.name, orb };
		}
	}
	return null;
}

function calculateAspects(planets: PlanetData[]): Aspect[] {
	const aspects: Aspect[] = [];
	const planetPairs: [string, number][] = planets.map((p) => [p.name, p.longitude]);

	for (let i = 0; i < planetPairs.length; i++) {
		const p1 = planetPairs[i];
		if (!p1) continue;
		for (let j = i + 1; j < planetPairs.length; j++) {
			const p2 = planetPairs[j];
			if (!p2) continue;
			const aspect = calculateAspect(p1[1], p2[1]);
			if (aspect) {
				aspects.push({
					...aspect,
					planet1: p1[0],
					planet2: p2[0],
				});
			}
		}
	}

	return aspects.sort((a, b) => a.orb - b.orb);
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { planets, moonPhase, targetDate } = body;

		if (!planets || !targetDate) {
			return NextResponse.json({ error: "Missing astronomical data" }, { status: 400 });
		}

		const planetInfo = planets
			.map((p: PlanetData) => {
				const retroStatus = p.isRetrograde ? " [RETROGRADE]" : "";
				return `${p.name}: ${p.zodiacSign} ${p.zodiacDegree.toFixed(2)}°${retroStatus}`;
			})
			.join("\n");

		const aspects = calculateAspects(planets);
		const significantAspects = aspects.slice(0, 8);

		const aspectInfo =
			significantAspects.length > 0
				? significantAspects
						.map((a) => `${a.planet1} ${a.aspect} ${a.planet2} (orb: ${a.orb.toFixed(1)}°)`)
						.join("\n")
				: "No major aspects currently active";

		const prompt = `You are an astrologer. Be direct and concise.

CHART: ${targetDate}

POSITIONS:
${planetInfo}

ASPECTS: ${significantAspects.length} active
${aspectInfo}

MOON: ${moonPhase.phaseName} (${moonPhase.illumination.toFixed(1)}%)

Respond with SHORT sentences (1-2 lines each):

1. "energetic_tone" - One sentence on the overall energy
2. "key_aspects" - 1-2 most significant aspects briefly
3. "retrograde_impact" - Any retrogrades affecting the chart
4. "supported_actions" - What actions are favored (1-2 items)
5. "caution_areas" - What to avoid (1-2 items)
6. "power_moment" - Is it potent? Yes/no + brief why

Keep it brief. No poetic language.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a direct astrologer. Keep responses brief and actionable.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.5,
			max_tokens: 800,
			response_format: { type: "json_object" },
		});

		const content = completion.choices[0]?.message?.content;
		let interpretation: Record<string, string> | null;

		try {
			interpretation = content ? (JSON.parse(content) as Record<string, string>) : null;
		} catch (_e) {
			console.error("Failed to parse JSON", content);
			interpretation = {
				energetic_tone: "The cosmic winds are shifting...",
				key_alignments: "Planets align in mysterious ways...",
				supported_actions: "Listen to the celestial rhythms...",
				caution_areas: "Some paths remain obscured...",
				power_moment: "Each moment holds unique potential...",
			};
		}

		return NextResponse.json({ interpretation });
	} catch (error) {
		console.error("Astronomy Interpretation Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
