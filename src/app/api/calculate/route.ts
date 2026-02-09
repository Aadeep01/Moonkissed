import { NextResponse } from "next/server";
import { calculateSigns } from "@/lib/astrology";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

export async function POST(request: Request) {
	try {
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
		const { sunSign, moonSign, risingSign } = calculateSigns(fullBirthDate, latitude, longitude);

		// Store in database
		const chart = await BirthChart.create({
			name,
			birthDate: fullBirthDate,
			birthTime,
			birthPlace,
			latitude,
			longitude,
			sunSign,
			moonSign,
			risingSign,
		});

		return NextResponse.json({ id: chart._id, sunSign, moonSign, risingSign });
	} catch (error: any) {
		console.error("Calculation Error:", error);
		return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
	}
}
