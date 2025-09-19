const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
  phone: { type: String },
  licenseNumber: { type: String },
  specialization: { type: String },
  workerId: { type: String },
  age: { type: String },
  gender: { type: String },
  adhaar: { type: String },
  address: {
    fullName: { type: String },
    fatherName: { type: String },
    atpo: { type: String },
    dist: { type: String },
    state: { type: String },
    pin: { type: String },
    landmark: { type: String }
  }
});
module.exports = mongoose.model('User', UserSchema);
