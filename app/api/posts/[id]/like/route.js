import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    // Get the request body (userId)
    const body = await req.json();
    const { userId } = body;
    const { id } = params;

    // Connect to database
    const { db } = await connectToDatabase();

    // Find the post by ID
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), { status: 404 });
    }

    // Check if the user has already liked the post
    const isAlreadyLiked = post.likes.includes(userId);

    // Update the like count
    let updatedPost;
    if (isAlreadyLiked) {
      // Remove the userId from likes array if they are already liked
      updatedPost = await db.collection("posts").updateOne(
        { _id: new ObjectId(id) },
        { $pull: { likes: userId } } // Remove userId from likes array
      );
    } else {
      // Add the userId to likes array if not already liked
      updatedPost = await db.collection("posts").updateOne(
        { _id: new ObjectId(id) },
        { $push: { likes: userId } } // Add userId to likes array
      );
    }

    // Retrieve the updated post
    const updatedPostData = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    // Return the updated post data
    return new Response(JSON.stringify({ post: updatedPostData }), { status: 200 });
  } catch (error) {
    console.error("Error updating like count:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
