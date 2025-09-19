import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
// @ts-ignore
import bcrypt from "bcryptjs";
import { signToken } from "../auth/token";

// Simple mock authentication API
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  await connectToDatabase();
  const user = await User.findOne({ email: username });
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }
  const token = signToken({ userId: user._id, role: user.role });
  return NextResponse.json({ success: true, role: user.role, userId: user._id, token });
}
