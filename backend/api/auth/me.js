const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
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
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
