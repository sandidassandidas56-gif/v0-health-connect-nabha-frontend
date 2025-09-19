

import mongoose, { ConnectOptions } from "mongoose";
// If using TypeScript, ensure @types/node is installed for process types
// npm install --save-dev @types/node
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (globalThis as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    } as ConnectOptions).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  (globalThis as any).mongoose = cached;
  return cached.conn;
}
