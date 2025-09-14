import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Report from "@/lib/models/Report";

export async function POST(req: NextRequest) {
  // Parse multipart form data (for file upload)
  // NOTE: Next.js API routes do not natively support multipart parsing. Use 'formidable' or similar for production.
  // For now, accept JSON with name, url, userId.
  await connectToDatabase();
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
  }
  const { name, url, userId } = data;
  if (!name || !url || !userId) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }
  const report = await Report.create({ name, url, userId });
  return NextResponse.json({ success: true, report });
}

export async function GET() {
  await connectToDatabase();
  const reports = await Report.find().sort({ uploadedAt: -1 }).limit(20);
  return NextResponse.json({ reports });
}
