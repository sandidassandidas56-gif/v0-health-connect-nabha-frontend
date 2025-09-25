const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Signup request body:', req.body);
  const {
    name,
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
    address,
    assignedVillage,
    registrationNo
  } = req.body;

  // Basic validation
  const missing = [];
  if (!email) missing.push('email');
  if (!password) missing.push('password');
  if (!role) missing.push('role');
  if (missing.length > 0) {
    console.warn('Signup missing required fields', { missing, received: req.body });
    return res.status(400).json({ error: 'Missing required fields', missingFields: missing, received: req.body });
  }

  try {
    // map frontend fields to model shape
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashed,
      role,
      phone: phone || undefined,
      licenseNumber: licenseNumber || registrationNo || undefined,
      specialization: specialization || undefined,
      workerId: workerId || undefined,
      age: age || undefined,
      gender: gender || undefined,
      adhaar: adhaar || undefined,
      address: address || (name ? { fullName: name } : undefined),
      assignedVillage: assignedVillage || undefined
    });

    await user.save();
    console.log('User created:', user._id);
    return res.status(201).json({ success: true, message: 'User created', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error creating user:', err);
    // duplicate key (email) or validation error
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
