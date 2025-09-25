import { NextRequest, NextResponse } from "next/server";
// Use relative imports because this file lives under backend/
import { connectToDatabase } from "../../db";
import User from "../../models/User";
// @ts-ignore
import bcrypt from "bcryptjs";
import { signToken } from "./token";

// Simple mock authentication API
export async function POST(req: NextRequest) {
  const body = await req.json();
  // accept either `username` or `email` from different clients
  const email = body.email || body.username;
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
  }
  await connectToDatabase();
  const user = await User.findOne({ email });
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
