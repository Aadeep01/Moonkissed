import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Horoscope from "@/models/Horoscope";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function GET(request: Request, { params }: { params: Promise<{ sign: string }> }) {
	try {
		await dbConnect();
		const { sign } = await params;
		const today = new Date().toISOString().split("T")[0];

		// 1. Check cache
		const cached = await Horoscope.findOne({ sign, date: today });
		if (cached) {
			return NextResponse.json({ horoscope: cached.content, cached: true });
		}

		// 2. Generate new horoscope if not cached
		const prompt = `You are a mystical astrologer. Generate a concise, poetic, and premium daily horoscope for the sign ${sign}. 
Focus on the energy of today, offering one piece of soulful advice. 
Keep it to 2-3 sentences. Do not use generic cliches. Write in a sophisticated, mysterious tone.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a master of celestial wisdom who speaks in poetic but clear truths.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.7,
			max_tokens: 300,
		});

		const horoscope =
			completion.choices[0]?.message?.content ||
			"The stars are silent today, but their presence remains.";

		// 3. Cache it
		await Horoscope.create({
			sign,
			date: today,
			content: horoscope,
		});

		return NextResponse.json({ horoscope, cached: false });
	} catch (error) {
		console.error("Horoscope Error:", error);
		return NextResponse.json({ error: "The stars are momentarily obscured." }, { status: 500 });
	}
}
