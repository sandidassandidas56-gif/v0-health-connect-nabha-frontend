import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Consultation from "@/lib/models/Consultation";
import { verifyToken } from "../auth/token";

export async function GET(req: NextRequest) {
  // JWT verification
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  // Role-based access: only admin and doctor can view all consultations
  if (user.role !== "admin" && user.role !== "doctor") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  await connectToDatabase();
  const consultations = await Consultation.find().sort({ date: -1 }).limit(20);
  return NextResponse.json({ consultations });
}

export async function POST(req: NextRequest) {
  // JWT verification
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  // Role-based access: only admin and doctor can create consultations
  if (user.role !== "admin" && user.role !== "doctor") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }
  await connectToDatabase();
  const data = await req.json();
  const { doctor, patient, date, status } = data;
  if (!doctor || !patient || !date || !status) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }
  const consultation = await Consultation.create({ doctor, patient, date, status });
  return NextResponse.json({ success: true, consultation });
}
