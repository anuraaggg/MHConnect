import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Get token from cookies (await it)
    const cookieStore = await cookies(); // Await here
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user by ID (convert _id to ObjectId)
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}