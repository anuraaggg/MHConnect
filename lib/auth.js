import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./mongodb";

// Get the authenticated user from the request
export async function getUser(request) {
  try {
    // ✅ Await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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
    const user = await db.collection("users").findOne({ _id: decoded.id });
    if (!user) {
      return null;
    }

    // Return user data (without password)
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

// Middleware to check if user is authenticated
export async function requireAuth(request) {
  const user = await getUser(request);

  if (!user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return { props: { user } };
}

// Middleware to check if user is a professional
export async function requireProfessional(request) {
  const user = await getUser(request);

  if (!user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (user.userType !== "professional") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: { user } };
}