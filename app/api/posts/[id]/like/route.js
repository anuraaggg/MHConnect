import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req, { params }) {
  // Await params to ensure dynamic route variables are correctly resolved
  const { id: postId } = await params;
  const { userId, like } = await req.json(); // Assuming the client sends userId and the action ('like' or 'unlike')

  const { db } = await connectToDatabase();

  try {
    // Fetch the post by its ID
    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    // Initialize `likedBy` as an empty array if it doesn't exist
    let updatedLikes = post.likes || 0;
    let likedByUser = post.likedBy || [];

    if (like) {
      // If the user hasn't liked the post yet, increase the like count
      if (!likedByUser.includes(userId)) {
        likedByUser.push(userId);
        updatedLikes++;
      }
    } else {
      // If the user has already liked the post, decrease the like count
      if (likedByUser.includes(userId)) {
        likedByUser = likedByUser.filter(id => id !== userId);
        updatedLikes--;
      }
    }

    // Update the post with the new like count and likedBy users
    const updateResult = await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $set: { likes: updatedLikes, likedBy: likedByUser } }
    );

    // If the update failed, return an error
    if (updateResult.modifiedCount === 0) {
      return new Response("Failed to update post", { status: 500 });
    }

    return new Response(JSON.stringify({ likes: updatedLikes }), { status: 200 });

  } catch (error) {
    console.error("Error while processing like:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
