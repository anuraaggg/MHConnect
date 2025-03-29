import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Fetch all posts (GET)
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const posts = await db.collection("posts")
      .find({})
      .sort({ createdAt: -1 }) // Sort newest first
      .toArray();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error fetching posts:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Create a new post (POST)
export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Post content is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const newPost = {
      _id: new ObjectId(),
      authorId: new ObjectId(user.id),
      authorName: user.name,
      content,
      createdAt: new Date(), // ✅ Use Date object (MongoDB handles it)
      likes: 0,
      comments: [],
    };

    await db.collection("posts").insertOne(newPost);

    return NextResponse.json({ 
      message: "Post created successfully", 
      post: newPost,
    }, { status: 201 });

  } catch (error) {
    console.error("🔥 Error creating post:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Handle like update (PUT)
export async function PUT(request) {
  try {
    const { postId } = request.query;  // Get the post ID from the URL
    const { db } = await connectToDatabase();

    // Find the post by ID
    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Increment the like count
    const updatedPost = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    return NextResponse.json({ post: updatedPost.value }, { status: 200 });

  } catch (error) {
    console.error("🔥 Error updating likes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
