const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your real secret!
    console.log('Decoded JWT payload:', decoded);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
