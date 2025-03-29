import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

export async function getUser(request) {
  try {
    // ✅ DO NOT await cookies()
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value; // ✅ No need to await

    if (!token) {
      return null;
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user by ID
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}
