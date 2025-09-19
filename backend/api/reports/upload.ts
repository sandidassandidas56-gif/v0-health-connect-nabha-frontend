import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Report from "@/lib/models/Report";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  // Parse multipart form data
  const formData = await req.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");
  if (!file || !userId || typeof file === "string") {
    return NextResponse.json({ success: false, message: "Missing file or userId" }, { status: 400 });
  }
  // Save file to local disk (public/uploads)
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
  await fs.mkdir(path.dirname(uploadPath), { recursive: true });
  await fs.writeFile(uploadPath, buffer);
  // Save report record in DB
  const url = `/uploads/${filename}`;
  const report = await Report.create({ name: file.name, url, userId });
  return NextResponse.json({ success: true, report });
}
