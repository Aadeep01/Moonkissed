import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

interface SynthesisResponse {
	core_identity: string;
	emotional_world: string;
	mind_and_heart: string;
	destiny_path: string;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign, name } = body;

		if (!sunSign || !moonSign || !risingSign) {
			return NextResponse.json({ error: "Missing astrological signs" }, { status: 400 });
		}

		const prompt = `You are a mystical astrologer. Generate a structured JSON response for a birth chart with:
Sun: ${sunSign}
Moon: ${moonSign}
Rising: ${risingSign}
Mercury: ${mercurySign}
Venus: ${venusSign}
Mars: ${marsSign}
${name ? `Name: ${name}` : ""}

Return ONLY a valid JSON object with these exact keys:
{
  "core_identity": "A poetic paragraph about their Sun (${sunSign}) and Moon (${moonSign}) synthesis, focusing on their conscious and subconscious self.",
  "emotional_world": "A rich paragraph about their inner emotional landscape defined by the Moon and Rising interactions.",
  "mind_and_heart": "A paragraph connecting their Mercury (${mercurySign}) communication style with their Venus (${venusSign}) love language.",
  "destiny_path": "A powerful closing paragraph about their Mars (${marsSign}) drive and how it fuels their life's purpose."
}

Use evocative, premium, mystical language. No markdown formatting, just raw JSON.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a master astrologer. You output only valid JSON.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.7,
			max_tokens: 1024,
			top_p: 0.9,
			response_format: { type: "json_object" },
		});

		const content = completion.choices[0]?.message?.content;
		let synthesis: SynthesisResponse;

		try {
			synthesis = content ? JSON.parse(content) : null;
		} catch (_e) {
			console.error("Failed to parse JSON", content);
			synthesis = {
				core_identity: "The stars are aligning...",
				emotional_world: "Nebulas are forming...",
				mind_and_heart: "Cosmic whispers...",
				destiny_path: "A path reveals itself...",
			};
		}

		return NextResponse.json({ synthesis });
	} catch (error) {
		console.error("Synthesis Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
