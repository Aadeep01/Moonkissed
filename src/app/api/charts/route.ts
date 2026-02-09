import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";

export async function GET() {
	try {
		await dbConnect();
		const charts = await BirthChart.find()
			.sort({ createdAt: -1 })
			.select("name sunSign moonSign risingSign createdAt")
			.lean();

		return NextResponse.json(charts);
	} catch (error) {
		console.error("Fetch Charts Error:", error);
		return NextResponse.json({ error: "Failed to fetch charts" }, { status: 500 });
	}
}
