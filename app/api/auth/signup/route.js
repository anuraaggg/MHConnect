import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    const { name, email, password, userType, degree, institution, credentials } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user object
    const user = {
      name,
      email,
      password: hashedPassword,
      userType: userType || "casual",
      createdAt: new Date(),
    }

    // Add professional data if applicable
    if (userType === "professional") {
      if (!degree || !institution) {
        return NextResponse.json({ message: "Professional users must provide degree and institution" }, { status: 400 })
      }

      user.professional = {
        degree,
        institution,
        credentials: credentials || "",
        isVerified: false,
      }
    }

    // Insert user into database
    const result = await db.collection("users").insertOne(user)

    // Create user object to return (without password)
    const newUser = {
      id: result.insertedId,
      name: user.name,
      email: user.email,
      userType: user.userType,
    }

    // Generate JWT token
    const token = jwt.sign({ id: result.insertedId, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Set cookie with token
    const response = NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

