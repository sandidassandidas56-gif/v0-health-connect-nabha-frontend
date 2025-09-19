import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Prescription from "@/lib/models/Prescription";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { patientId, doctorId, medicines, address } = await req.json();

  // Find ASHA worker assigned to the area (example: by address.pincode)
  const ashaWorker = await User.findOne({ role: "asha", "address.pincode": address.pincode });

  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctorId,
    medicines,
    address,
    ashaWorker: ashaWorker?._id
  });

  // Optionally: Notify ASHA worker (e.g., via socket, email, etc.)

  return NextResponse.json({ success: true, prescription });
}
