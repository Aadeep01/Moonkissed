import { Body, Illumination, MakeTime, MoonPhase, SearchMoonPhase } from "astronomy-engine";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
	try {
		const now = new Date();
		const astroTime = MakeTime(now);

		// 1. Current Moon Stats
		const phaseDeg = MoonPhase(now);
		const illumination = Illumination(Body.Moon, now);

		let phaseName = "";
		let emoji = "🌙";
		if (phaseDeg < 22.5) {
			phaseName = "New Moon";
			emoji = "🌑";
		} else if (phaseDeg < 67.5) {
			phaseName = "Waxing Crescent";
			emoji = "🌒";
		} else if (phaseDeg < 112.5) {
			phaseName = "First Quarter";
			emoji = "🌓";
		} else if (phaseDeg < 157.5) {
			phaseName = "Waxing Gibbous";
			emoji = "🌔";
		} else if (phaseDeg < 202.5) {
			phaseName = "Full Moon";
			emoji = "🌕";
		} else if (phaseDeg < 247.5) {
			phaseName = "Waning Gibbous";
			emoji = "🌖";
		} else if (phaseDeg < 292.5) {
			phaseName = "Last Quarter";
			emoji = "🌗";
		} else if (phaseDeg < 337.5) {
			phaseName = "Waning Crescent";
			emoji = "🌘";
		} else {
			phaseName = "New Moon";
			emoji = "🌑";
		}

		// 2. Next Major Phases
		const nextFullMoon = SearchMoonPhase(180, astroTime, 30);
		const nextNewMoon = SearchMoonPhase(0, astroTime, 30);

		// 3. AI Interpretation of current lunation
		const prompt = `The moon is currently in its ${phaseName} phase (${(illumination.phase_fraction * 100).toFixed(1)}% illuminated). 
        Provide a 2-sentence mystical interpretation of what this lunar energy means for humanity right now. 
        Tone: Ethereal, insightful, premium.`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a lunar priestess who interprets the shifting tides of the moon.",
				},
				{ role: "user", content: prompt },
			],
			model: "llama-3.3-70b-versatile",
			temperature: 0.7,
			max_tokens: 150,
		});

		const interpretation =
			completion.choices[0]?.message?.content || "The moon's influence is subtle yet profound.";

		return NextResponse.json({
			moon: {
				phaseDeg,
				phaseName,
				emoji,
				illumination: illumination.phase_fraction,
				interpretation,
				nextFullMoon: nextFullMoon?.date.toISOString(),
				nextNewMoon: nextNewMoon?.date.toISOString(),
			},
		});
	} catch (error) {
		console.error("Moon Portal Error:", error);
		return NextResponse.json({ error: "The moon is hidden behind clouds." }, { status: 500 });
	}
}
