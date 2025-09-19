import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicines: [{ name: String, dosage: String, instructions: String }],
  address: { type: Object, required: true },
  ashaWorker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
