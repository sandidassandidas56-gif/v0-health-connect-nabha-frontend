const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function seed() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { maxPoolSize: 5 });

  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '9998887777',
      age: '45',
      gender: 'male',
      adhaar: '111122223333'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password: 'Password123!',
      role: 'doctor',
      phone: '8887776666',
      age: '35',
      gender: 'female',
      specialization: 'Pediatrics',
      licenseNumber: 'REG-12345'
    },
    {
      name: 'Demo User',
      email: 'demo.user@example.com',
      password: 'Password123!',
      role: 'asha',
      phone: '7776665555',
      workerId: 'ASHA-001',
      assignedVillage: 'Village A'
    }
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`User ${u.email} already exists — skipping`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    const user = new User({
      email: u.email,
      password: hashed,
      role: u.role,
      phone: u.phone,
      licenseNumber: u.licenseNumber,
      specialization: u.specialization,
      workerId: u.workerId,
      age: u.age,
      gender: u.gender,
      adhaar: u.adhaar,
      address: { fullName: u.name }
    });
    await user.save();
    console.log(`Created ${u.email}`);
  }

  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
