import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request: Request) {
	try {
		await dbConnect();
		const { name, email, password } = await request.json();

		if (!name || !email || !password) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return NextResponse.json(
			{ message: "User created successfully", user: { id: newUser._id, email: newUser.email } },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Signup Error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
