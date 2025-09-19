const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  // Remove users with mock/demo names or emails
  const result = await User.deleteMany({
    $or: [
      { email: /john.doe/i },
      { email: /priya.sharma/i },
      { 'address.fullName': /john doe/i },
      { 'address.fullName': /priya sharma/i },
      { email: /demo/i },
      { 'address.fullName': /demo/i }
    ]
  });
  console.log(`Deleted ${result.deletedCount} mock users.`);
  mongoose.disconnect();
}

cleanup();
