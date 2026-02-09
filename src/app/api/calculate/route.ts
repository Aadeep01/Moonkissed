import { NextResponse } from "next/server";
import { calculateSigns } from "@/lib/astrology";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = await request.json();
		const { name, birthDate, birthTime, birthPlace, latitude, longitude } = body;
		console.log("Received data:", { name, birthDate, birthTime, birthPlace, latitude, longitude });

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
		console.log("Full birth date:", fullBirthDate);

		// Calculate signs
		const { sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign } = calculateSigns(
			fullBirthDate,
			latitude,
			longitude,
		);
		console.log("Calculated signs:", {
			sunSign,
			moonSign,
			risingSign,
			mercurySign,
			venusSign,
			marsSign,
		});

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
			mercurySign,
			venusSign,
			marsSign,
		});

		return NextResponse.json({
			id: chart._id,
			sunSign,
			moonSign,
			risingSign,
			mercurySign,
			venusSign,
			marsSign,
		});
	} catch (error) {
		console.error("Calculation Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
		const errorStack = error instanceof Error ? error.stack : undefined;
		return NextResponse.json({ error: errorMessage, stack: errorStack }, { status: 500 });
	}
}
