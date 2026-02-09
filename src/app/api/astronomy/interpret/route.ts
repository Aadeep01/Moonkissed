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

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { planets, moonPhase, targetDate } = body;

		if (!planets || !targetDate) {
			return NextResponse.json({ error: "Missing astronomical data" }, { status: 400 });
		}

		// Format planet data for the prompt
		const planetInfo = planets
			.map((p: PlanetData) => {
				const retroStatus = p.isRetrograde ? " [RETROGRADE]" : "";
				return `${p.name}: ${p.zodiacSign} ${p.zodiacDegree.toFixed(2)}°${retroStatus} (Speed: ${p.speed.toFixed(4)}°/day)`;
			})
			.join("\n");

		const prompt = `You are an expert astronomical interpreter. Analyze the EXACT planetary positions for ${targetDate} and provide a precise cosmic forecast.

EXACT PLANETARY POSITIONS:
${planetInfo}

MOON PHASE: ${moonPhase.phaseName} (${moonPhase.illumination.toFixed(1)}% illuminated)

Based on these PRECISE astronomical positions (not generic sign meanings), provide:

1. What is the energetic tone of this moment based on exact degrees?
2. Which planetary configurations are most significant right now?
3. What actions or themes are supported by these specific alignments?
4. What should be approached with caution given these exact positions?

Provide your interpretation in a flowing, poetic yet precise manner. Focus on the EXACT degrees and positions, not generic zodiac sign descriptions. Consider retrograde motion and planetary speeds in your analysis.

Return ONLY a valid JSON object with these exact keys:
{
  "energetic_tone": "A paragraph describing the precise energetic quality of this moment based on exact planetary positions.",
  "key_alignments": "A paragraph highlighting the most significant exact degree-based configurations right now.",
  "supported_actions": "Specific guidance on what types of activities or themes are cosmically aligned at this exact moment.",
  "caution_areas": "What should be approached carefully given these precise astronomical positions.",
  "power_moment": "Is this a particularly powerful or significant moment? Why or why not based on the data?"
}

Use evocative, precise language that references the actual degrees and positions. No generic horoscope language.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a master astronomical interpreter who reads the precise language of the cosmos based on exact planetary positions and degrees.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.8,
			max_tokens: 1500,
			top_p: 0.9,
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
