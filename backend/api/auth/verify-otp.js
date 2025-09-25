const express = require('express');
const User = require('../../models/User');
const router = express.Router();

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.otp || !user.otpExpiry) return res.status(400).json({ error: 'No OTP set for user' });
    if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: 'OTP expired' });
    // Mark user as verified (add a field if needed)
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();
    res.json({ message: 'OTP verified, account activated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
