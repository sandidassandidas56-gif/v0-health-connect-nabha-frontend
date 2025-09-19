import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const {
    email,
    password,
    role,
    phone,
    licenseNumber,
    specialization,
    workerId,
    age,
    gender,
    adhaar,
    address,
  } = data;
  if (!email || !password || !role || !address?.fullName) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ success: false, message: "Email already registered" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    role,
    personalData: {
      phone,
      licenseNumber,
      specialization,
      workerId,
      age,
      gender,
      adhaar,
    },
    address: {
      ...address,
    },
  });
  return NextResponse.json({ success: true, user: { id: user._id, email: user.email, role: user.role, fullName: user.address?.fullName } });
}
