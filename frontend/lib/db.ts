import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sandidassandidas56_db_user:jDadHJOKbzXGhdNM@cluster0.hnna6hc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
