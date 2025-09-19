const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const {
    email,
    password,
    role,
    phone,
    licenseNumber,
    specialization,
    workerId,
    age,
    gender,
    adhaar,
    address
  } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      email,
      password: hashed,
      role,
      phone,
      licenseNumber,
      specialization,
      workerId,
      age,
      gender,
      adhaar,
      address
    });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

module.exports = router;
