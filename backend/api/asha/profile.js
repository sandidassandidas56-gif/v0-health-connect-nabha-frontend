const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const authMiddleware = require('../../middleware/auth');

// GET /api/asha/profile - Get current ASHA worker profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user || user.role !== 'asha') {
      return res.status(404).json({ error: 'ASHA worker not found' });
    }
    // Return only relevant ASHA fields
    const profile = {
      name: user.address?.fullName || user.fullName || user.name || '',
      address: user.address || {},
      phone: user.phone || '',
      assignedPrescriptions: user.assignedPrescriptions || [],
      // Add more ASHA-specific fields if needed
    };
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
