const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// GET /api/doctors - return list of users with role 'doctor'
router.get('/', async (req, res) => {
  if (!MONGO_URI) return res.status(500).json({ error: 'MONGO_URI not configured' });
  try {
    await mongoose.connect(MONGO_URI, { maxPoolSize: 5 });
    const doctors = await User.find({ role: 'doctor' }).select('email address licenseNumber specialization phone');
    res.json({ doctors });
  } catch (err) {
    console.error('Error fetching doctors', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  } finally {
    // keep connection pooling to let mongoose manage it; do not disconnect here
  }
});

module.exports = router;
