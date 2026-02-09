import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
	try {
		await dbConnect();
		const { chartId1, chartId2 } = await request.json();

		const [chart1, chart2] = await Promise.all([
			BirthChart.findById(chartId1).lean(),
			BirthChart.findById(chartId2).lean(),
		]);

		if (!chart1 || !chart2) {
			return NextResponse.json({ error: "One or both charts not found" }, { status: 404 });
		}

		const prompt = `You are a master of synastry and relationship astrology. 
Analyze the compatibility between two souls:
Person 1 (${chart1.name}): Sun in ${chart1.sunSign}, Moon in ${chart1.moonSign}, Rising in ${chart1.risingSign}.
Person 2 (${chart2.name}): Sun in ${chart2.sunSign}, Moon in ${chart2.moonSign}, Rising in ${chart2.risingSign}.

Also consider their personal planets:
Person 1: Mercury (${chart1.mercurySign}), Venus (${chart1.venusSign}), Mars (${chart1.marsSign}).
Person 2: Mercury (${chart2.mercurySign}), Venus (${chart2.venusSign}), Mars (${chart2.marsSign}).

Provide:
1. A compatibility score (0-100%).
2. A poetic, high-end interpretation of their spiritual and emotional connection.
3. Key strengths and potential challenges in their alignment.

Format the response as JSON:
{
  "score": number,
  "interpretation": "...",
  "strengths": ["...", "..."],
  "challenges": ["...", "..."]
}`;

		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"You are a master astrologer. Your readings are premium, poetic, and psychologically insightful. Always return strictly valid JSON.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "llama-3.3-70b-versatile",
			response_format: { type: "json_object" },
			temperature: 0.7,
		});

		const result = JSON.parse(completion.choices[0]?.message?.content || "{}");

		return NextResponse.json({
			...result,
			person1: { name: chart1.name, sunSign: chart1.sunSign },
			person2: { name: chart2.name, sunSign: chart2.sunSign },
			person1Chart: JSON.parse(JSON.stringify(chart1)),
			person2Chart: JSON.parse(JSON.stringify(chart2)),
		});
	} catch (error) {
		console.error("Synastry Error:", error);
		return NextResponse.json({ error: "The cosmos is clouded today." }, { status: 500 });
	}
}
