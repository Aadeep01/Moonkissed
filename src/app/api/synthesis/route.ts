import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { sunSign, moonSign, risingSign, name } = body;

		if (!sunSign || !moonSign || !risingSign) {
			return NextResponse.json({ error: "Missing astrological signs" }, { status: 400 });
		}

		const prompt = `You are a mystical astrologer with deep knowledge of celestial wisdom. Generate a personalized, poetic cosmic synthesis for someone with the following birth chart:

Sun Sign: ${sunSign}
Moon Sign: ${moonSign}
Rising Sign (Ascendant): ${risingSign}
${name ? `Name: ${name}` : ""}

Create a 3-4 paragraph reading that:
1. Explains how their ${sunSign} Sun (core identity) interacts with their ${moonSign} Moon (emotional nature)
2. Describes how their ${risingSign} Rising sign shapes how they present themselves to the world
3. Weaves these three energies into a cohesive narrative about their soul's journey
4. Uses evocative, mystical language that feels premium and profound

Write in second person ("you"), be specific to these exact sign combinations, and make it feel like a personalized oracle reading. Avoid generic horoscope language.`;

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
