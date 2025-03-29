import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const professionals = await db.collection("professionals").find().toArray();
    return NextResponse.json(professionals, { status: 200 });
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json({ message: "Error fetching professionals" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const { name, title, specialties, institution, degree, bio, content } = body;

    if (!name || !title || !specialties || !institution || !degree || !bio || !content) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const result = await db.collection("professionals").insertOne({
      name,
      title,
      specialties,
      institution,
      degree,
      bio,
      content,
    });

    return NextResponse.json({ message: "Professional post added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error adding professional post:", error);
    return NextResponse.json({ message: "Error adding professional post" }, { status: 500 });
  }
}
