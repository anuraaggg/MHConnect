import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req, { params }) {
  const { id: postId } = params;
  const { userId, like } = await req.json(); // Assuming the client sends userId and the action ('like' or 'unlike')

  const { db } = await connectToDatabase();
  
  // Fetch the post by its ID
  const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Toggle like status
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
  await db.collection("posts").updateOne(
    { _id: new ObjectId(postId) },
    { $set: { likes: updatedLikes, likedBy: likedByUser } }
  );

  return Response.json({ likes: updatedLikes });
}
