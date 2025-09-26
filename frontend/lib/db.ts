import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";

if (!MONGODB_URI) {
  // Fail fast in non-production local runs so developer sees the problem early.
  // In deployed environments, set the MONGODB_URI environment variable in the host.
  console.warn(
    "Warning: MONGODB_URI is not set. Database connections will fail.\n" +
      "Set MONGODB_URI (or MONGO_URI) in your environment variables before running the app."
  );
}

const cached: { conn: any; promise: Promise<any> | null } = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
