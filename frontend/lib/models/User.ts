import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  phone?: string;
  licenseNumber?: string;
  specialization?: string;
  workerId?: string;
  address?: {
    fullName?: string;
    fatherName?: string;
    atpo?: string;
    dist?: string;
    state?: string;
    pin?: string;
    landmark?: string;
  };
  age?: number;
  gender?: string;
  adhaar?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  phone: String,
  licenseNumber: String,
  specialization: String,
  workerId: String,
  address: {
    fullName: String,
    fatherName: String,
    atpo: String,
    dist: String,
    state: String,
    pin: String,
    landmark: String,
  },
  age: Number,
  gender: String,
  adhaar: String,
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
