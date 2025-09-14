import mongoose, { Schema, Document } from "mongoose";

export interface IConsultation extends Document {
  doctor: string;
  patient: string;
  date: Date;
  status: string;
}

const ConsultationSchema: Schema = new Schema({
  doctor: { type: String, required: true },
  patient: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
});

export default mongoose.models.Consultation || mongoose.model<IConsultation>("Consultation", ConsultationSchema);
