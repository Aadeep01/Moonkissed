import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import BirthChart from "@/models/BirthChart";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const charts = await BirthChart.find({ userId: (session.user as any).id })
			.sort({ createdAt: -1 })
			.select("name sunSign moonSign risingSign createdAt")
			.lean();

		return NextResponse.json(charts);
	} catch (error) {
		console.error("Fetch Charts Error:", error);
		return NextResponse.json({ error: "Failed to fetch charts" }, { status: 500 });
	}
}
