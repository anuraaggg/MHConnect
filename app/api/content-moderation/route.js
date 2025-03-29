import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { content } = await req.json();

    // Call Vector Profanity API
    const response = await fetch("https://vector.profanity.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });

    const data = await response.json();

    console.log("🔍 Profanity Check:", data); // Debugging log

    if (data.probability >= 0.5) {
      console.log("🚨 Content Blocked! 🚨", data.probability);
      return NextResponse.json(
        { flagged: true, message: "Inappropriate content detected.", score: data.probability },
        { status: 400 }
      );
    }

    return NextResponse.json({ flagged: false, message: "Content is safe." });
  } catch (error) {
    console.error("❌ Error in content moderation:", error);
    return NextResponse.json({ message: "Error during content moderation." }, { status: 500 });
  }
}
