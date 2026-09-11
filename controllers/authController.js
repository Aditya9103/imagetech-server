const jwt = require('jsonwebtoken');

/**
 * @desc    Authenticate admin & generate JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ message: 'Server misconfiguration: ADMIN_PASSWORD not set.' });
  }

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, username });
};

/**
 * @desc    Verify if JWT token is valid
 * @route   GET /api/auth/verify
 * @access  Public (Bearer token in header)
 */
const verifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
};

module.exports = {
  login,
  verifyToken,
};
