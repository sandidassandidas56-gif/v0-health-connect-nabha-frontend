const mongoose = require('mongoose');


require('dotenv').config();
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
