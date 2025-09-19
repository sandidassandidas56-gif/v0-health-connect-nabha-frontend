const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
  res.json({
    token,
    user: {
      email: user.email,
      role: user.role,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      adhaar: user.adhaar,
      address: user.address,
      licenseNumber: user.licenseNumber,
      specialization: user.specialization,
      workerId: user.workerId,
      id: user._id
    }
  });
});

module.exports = router;
