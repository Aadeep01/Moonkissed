import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign, name } = body;

		if (!sunSign || !moonSign || !risingSign) {
			return NextResponse.json({ error: "Missing astrological signs" }, { status: 400 });
		}

		const prompt = `You are a mystical astrologer with deep knowledge of celestial wisdom. Generate a personalized, poetic cosmic synthesis for someone with the following birth chart:

Sun Sign (Identity): ${sunSign}
Moon Sign (Emotion): ${moonSign}
Rising Sign (Persona): ${risingSign}
Mercury Sign (Mind): ${mercurySign}
Venus Sign (Heart): ${venusSign}
Mars Sign (Drive): ${marsSign}
${name ? `Name: ${name}` : ""}

Create a comprehensive 4-5 paragraph reading that:
1. Explains the core tension and harmony between their ${sunSign} Sun and ${moonSign} Moon.
2. Describes how their ${risingSign} Rising sign acts as the gateway for their ${mercurySign} mind and ${venusSign} heart.
3. Touches upon how their ${marsSign} drive provides the energy to fulfill their ${sunSign} destiny.
4. Weaves all six celestial signatures into a cohesive narrative about their soul's specific purpose.

Write in second person ("you"), be specific to these exact sign combinations, and use evocative, mystical, premium language. Avoid clichéd horoscope generalities.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a master astrologer who creates deeply personalized, poetic cosmic readings. Your language is mystical, evocative, and premium. You avoid clichés and generic horoscope language.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.8,
			max_tokens: 1024,
			top_p: 0.9,
		});

		const synthesis = completion.choices[0]?.message?.content || "The stars are aligning...";

		return NextResponse.json({ synthesis });
	} catch (error) {
		console.error("Synthesis Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
