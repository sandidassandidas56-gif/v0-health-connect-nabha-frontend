const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not set. Please set MONGO_URI in backend/.env');
  process.exit(1);
}

const connectOptions = {
  // Use the defaults recommended by mongoose v6+
  // You can add authSource, replicaSet, etc. if needed in production
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
};

mongoose.connect(uri, connectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = mongoose;
