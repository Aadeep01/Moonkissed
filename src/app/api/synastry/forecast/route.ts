import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_KEY,
});

interface Aspect {
	planet1: string;
	planet2: string;
	aspect: string;
	orb: number;
	interpretation: string;
}

const ASPECT_TYPES = [
	{
		name: "Conjunction",
		angle: 0,
		orb: 8,
		interpretation: "Blending of energies, shared focus",
		power: 3,
	},
	{
		name: "Sextile",
		angle: 60,
		orb: 6,
		interpretation: "Harmonious opportunity, ease of expression",
		power: 1,
	},
	{
		name: "Square",
		angle: 90,
		orb: 8,
		interpretation: "Tension requiring adjustment, growth through friction",
		power: 2,
	},
	{
		name: "Trine",
		angle: 120,
		orb: 8,
		interpretation: "Natural flow, talents support each other",
		power: 1,
	},
	{
		name: "Opposition",
		angle: 180,
		orb: 8,
		interpretation: "Polarities seeking integration, projection",
		power: 2,
	},
];

function calculateAspect(p1Lon: number, p2Lon: number): Aspect | null {
	let diff = Math.abs(p1Lon - p2Lon);
	if (diff > 180) diff = 360 - diff;

	for (const asp of ASPECT_TYPES) {
		const orb = Math.abs(diff - asp.angle);
		if (orb <= asp.orb) {
			return {
				planet1: "",
				planet2: "",
				aspect: asp.name,
				orb,
				interpretation: asp.interpretation,
			};
		}
	}
	return null;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { person1Chart, person2Chart, targetDate } = body;

		if (!person1Chart || !person2Chart || !targetDate) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}

		// Calculate natal planet positions for both
		const p1Natal = [
			{ name: "Sun", longitude: person1Chart.sunLong },
			{ name: "Moon", longitude: person1Chart.moonLong },
			{ name: "Mercury", longitude: person1Chart.mercuryLong },
			{ name: "Venus", longitude: person1Chart.venusLong },
			{ name: "Mars", longitude: person1Chart.marsLong },
			{ name: "Jupiter", longitude: person1Chart.jupiterLong || 0 },
			{ name: "Saturn", longitude: person1Chart.saturnLong || 0 },
		];

		const p2Natal = [
			{ name: "Sun", longitude: person2Chart.sunLong },
			{ name: "Moon", longitude: person2Chart.moonLong },
			{ name: "Mercury", longitude: person2Chart.mercuryLong },
			{ name: "Venus", longitude: person2Chart.venusLong },
			{ name: "Mars", longitude: person2Chart.marsLong },
			{ name: "Jupiter", longitude: person2Chart.jupiterLong || 0 },
			{ name: "Saturn", longitude: person2Chart.saturnLong || 0 },
		];

		// Calculate synastry aspects (p1 planets -> p2 planets)
		const synastryAspects: Aspect[] = [];
		for (const p1 of p1Natal) {
			for (const p2 of p2Natal) {
				const aspect = calculateAspect(p1.longitude, p2.longitude);
				if (aspect) {
					synastryAspects.push({
						planet1: p1.name,
						planet2: p2.name,
						aspect: aspect.aspect,
						orb: aspect.orb,
						interpretation: aspect.interpretation,
					});
				}
			}
		}

		// Sort by orb (most significant first)
		synastryAspects.sort((a, b) => a.orb - b.orb);

		// Calculate relationship dynamics based on aspect patterns
		const harmonious = synastryAspects.filter(
			(a) => a.aspect === "Trine" || a.aspect === "Sextile",
		).length;
		const challenging = synastryAspects.filter(
			(a) => a.aspect === "Square" || a.aspect === "Opposition",
		).length;
		const blending = synastryAspects.filter((a) => a.aspect === "Conjunction").length;

		const sunAspects = synastryAspects.filter((a) => a.planet1 === "Sun" || a.planet2 === "Sun");
		const venusMarsAspects = synastryAspects.filter(
			(a) =>
				(a.planet1 === "Venus" && a.planet2 === "Mars") ||
				(a.planet1 === "Mars" && a.planet2 === "Venus"),
		);

		// Build comprehensive astrological report
		const astroReport = {
			person1Name: person1Chart.name,
			person2Name: person2Chart.name,
			targetDate,
			dominantDynamics: {
				harmonious,
				challenging,
				blending,
				overall:
					harmonious > challenging
						? "Harmonious with growth potential"
						: challenging > harmonious
							? "Challenging but transformative"
							: "Balanced connection",
			},
			synastryAspects: synastryAspects.slice(0, 5),
			sunConnection:
				sunAspects.length > 0
					? {
							howTheySeeEachOther: sunAspects
								.map((a) => `${a.planet1}-${a.planet2}: ${a.aspect}`)
								.join(", "),
							powerDynamic: sunAspects.find((a) => a.aspect === "Conjunction")
								? "Fused identities, strong mutual recognition"
								: sunAspects.find((a) => a.aspect === "Square")
									? "Different approaches creating productive tension"
									: sunAspects.find((a) => a.aspect === "Trine")
										? "Natural understanding of each other's essence"
										: "Engaging with each other's core identity",
						}
					: null,
			venusMarsDynamics:
				venusMarsAspects.length > 0
					? {
							romanticAndSexual: venusMarsAspects
								.map((a) => `${a.aspect} (orb: ${a.orb.toFixed(1)}°)`)
								.join(", "),
							style: venusMarsAspects.find((a) => a.aspect === "Conjunction")
								? "Passionate, unified desires"
								: venusMarsAspects.find((a) => a.aspect === "Square")
									? "Tension in attraction, sparking chemistry"
									: venusMarsAspects.find((a) => a.aspect === "Trine")
										? "Natural alignment in desire and action"
										: "Developing attraction and chemistry",
						}
					: null,
		};

		// Use AI to interpret this calculated astrological data
		const prompt = `You are an expert relationship astrologer. Analyze this SYNSTRY REPORT for ${person1Chart.name} and ${person2Chart.name}:

SYNSTRY ANALYSIS:
- Overall Dynamics: ${astroReport.dominantDynamics.overall}
- Harmonious Aspects (Trines, Sextiles): ${harmonious}
- Challenging Aspects (Squares, Oppositions): ${challenging}
- Blending Aspects (Conjunctions): ${blending}

${
	astroReport.sunConnection
		? `SUN CONNECTION:
- Aspects: ${astroReport.sunConnection.howTheySeeEachOther}
- Power Dynamic: ${astroReport.sunConnection.powerDynamic}`
		: ""
}

${
	astroReport.venusMarsDynamics
		? `VENUS-MARS DYNAMICS (Romantic/Sexual):
- Aspects: ${astroReport.venusMarsDynamics.romanticAndSexual}
- Style: ${astroReport.venusMarsDynamics.style}`
		: ""
}

KEY ASPECTS (sorted by significance):
${astroReport.synastryAspects.map((a) => `- ${a.planet1} ${a.aspect} ${a.planet2}: ${a.interpretation} (orb: ${a.orb.toFixed(1)}°)`).join("\n")}

Based on this ASTROLOGICAL ANALYSIS (NOT generic horoscopes), provide SPECIFIC guidance. Return ALL values as PLAIN TEXT STRINGS, not objects:

1. "relationship_energy" - What is the CORE energetic quality based on these ASPECTS? (1-2 sentences, plain text)
2. "how_person1_should_approach" - What should ${person1Chart.name} GIVE, TAKE, and AVOID with ${person2Chart.name}? (format: "Give: X. Take: Y. Avoid: Z." as plain text)
3. "how_person2_should_approach" - Same format for ${person2Chart.name}
4. "karmic_indicators" - Any fated patterns or relationship lessons (plain text)
5. "potential_challenges" - Where friction exists SPECIFICALLY (plain text)
6. "growth_opportunities" - How they grow TOGETHER (plain text)
7. "overall_verdict" - One powerful closing thought (plain text)

Return ONLY valid JSON with string values. Reference the SPECIFIC ASPECTS in your answer.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a master relationship astrologer. You interpret ASPECTS specifically - what Conjunction, Square, Trine, etc. MEAN in relationships.",
				},
				{ role: "user", content: prompt },
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.7,
			max_tokens: 1500,
			response_format: { type: "json_object" },
		});

		const content = completion.choices[0]?.message?.content;
		let interpretation: Record<string, string>;

		try {
			const parsed = content ? JSON.parse(content) : null;
			if (parsed) {
				interpretation = {
					relationship_energy: String(
						parsed.relationship_energy || "The cosmic connection unfolds...",
					),
					how_person1_should_approach: flattenApproach(parsed.how_person1_should_approach),
					how_person2_should_approach: flattenApproach(parsed.how_person2_should_approach),
					karmic_indicators: String(parsed.karmic_indicators || "Destiny weaves subtle threads..."),
					potential_challenges: String(parsed.potential_challenges || "Patience is key..."),
					growth_opportunities: String(parsed.growth_opportunities || "Love conquers all..."),
					overall_verdict: String(parsed.overall_verdict || "This connection holds promise..."),
				};
			} else {
				interpretation = getFallbackInterpretation();
			}
		} catch {
			interpretation = getFallbackInterpretation();
		}

		function flattenApproach(value: unknown): string {
			if (typeof value === "string") return value;
			if (typeof value === "object" && value !== null) {
				const obj = value as Record<string, unknown>;
				if ("give" in obj && "take" in obj && "avoid" in obj) {
					return `Give: ${obj.give}\nTake: ${obj.take}\nAvoid: ${obj.avoid}`;
				}
				return JSON.stringify(value);
			}
			return "Approach with openness and authenticity...";
		}

		function getFallbackInterpretation() {
			return {
				relationship_energy: "The stars align for this connection...",
				how_person1_should_approach: "Trust the journey and embrace the moment...",
				how_person2_should_approach: "Follow your heart with courage...",
				karmic_indicators: "Destiny weaves subtle threads between souls...",
				potential_challenges: "Patience and understanding are key...",
				growth_opportunities: "Together you can transcend individual limits...",
				overall_verdict: "This connection holds beautiful promise...",
			};
		}

		return NextResponse.json({
			...astroReport,
			interpretation,
		});
	} catch (error) {
		console.error("Synastry forecast error:", error);
		return NextResponse.json({ error: "Failed to calculate synastry forecast" }, { status: 500 });
	}
}
