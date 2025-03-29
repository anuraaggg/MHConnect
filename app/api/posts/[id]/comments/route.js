import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

// ✅ Add a comment to a post (POST)
export async function POST(request, { params }) {
  try {
    const postId = params.id;  // Get the post ID from the URL
    const { content } = await request.json();
    const user = await getUser(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const comment = {
      authorName: user.name,
      content,
      createdAt: new Date(),
    };

    // Update the post with the new comment
    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: comment } }
    );

    return NextResponse.json({
      message: "Comment added successfully",
      comment,
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Error adding comment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
