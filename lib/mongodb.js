import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ Please add your MongoDB URI to .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect()
      .then(client => {
        console.log("✅ Connected to MongoDB");
        return client;
      })
      .catch(error => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect()
    .then(client => {
      console.log("✅ Connected to MongoDB");
      return client;
    })
    .catch(error => {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    });
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "mental_health_platform");
  return { client, db };
}