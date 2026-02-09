import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { calculateSigns } from "@/lib/astrology";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		await dbConnect();
		const body = await request.json();
		const { name, birthDate, birthTime, birthPlace, latitude, longitude } = body;

		if (
			!name ||
			!birthDate ||
			!birthTime ||
			!birthPlace ||
			latitude === undefined ||
			longitude === undefined
		) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Prepare original date/time for library
		const fullBirthDate = new Date(`${birthDate}T${birthTime}`);

		// Calculate signs
		const result = calculateSigns(fullBirthDate, latitude, longitude);

		// Store in database
		const chart = await BirthChart.create({
			name,
			birthDate: fullBirthDate,
			birthTime,
			birthPlace,
			latitude,
			longitude,
			...result,
			userId: session?.user ? session.user.id : undefined,
		});

		return NextResponse.json({ id: chart._id, ...result });
	} catch (error) {
		console.error("Calculation Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
