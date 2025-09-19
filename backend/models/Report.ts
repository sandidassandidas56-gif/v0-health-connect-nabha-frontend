import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

const ReportSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
