import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"

// Get all posts
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Get posts with pagination
    const posts = await db
      .collection("posts")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            likes: 1,
            "author.name": 1,
            "author.userType": 1,
            "author._id": 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .toArray()

    // Get total count for pagination
    const total = await db.collection("posts").countDocuments()

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Create a new post
export async function POST(request) {
  try {
    // Get authenticated user
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    // Validate content
    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Post content is required" }, { status: 400 })
    }

    // Check content moderation
    const moderationRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content-moderation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: content }),
    })

    const moderation = await moderationRes.json()

    if (moderation.isOffensive) {
      return NextResponse.json(
        { message: "Your post contains content that may be offensive. Please revise and try again." },
        { status: 400 },
      )
    }

    // Special handling for self-harm content
    if (moderation.containsSelfHarm) {
      // In a real app, you might want to flag this for review or provide resources
      // For this demo, we'll just add a note to the post
      const updatedContent =
        content +
        "\n\n[Note: If you're experiencing thoughts of self-harm, please reach out for help. Resources are available at the National Suicide Prevention Lifeline: 1-800-273-8255]"
      content = updatedContent
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Create post
    const post = {
      authorId: user.id,
      content,
      createdAt: new Date(),
      likes: 0,
      comments: [],
    }

    const result = await db.collection("posts").insertOne(post)

    return NextResponse.json({ message: "Post created successfully", postId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

