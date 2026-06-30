const { generateToken } = require('../utils/auth');

const users = [
  { id: 'admin', email: 'admin@escrow.com', password: 'admin123', role: 'Admin' },
  { id: 'user1', email: 'user1@escrow.com', password: 'user123', role: 'User' },
  { id: 'user2', email: 'user2@escrow.com', password: 'user123', role: 'User' },
  { id: 'user3', email: 'user3@escrow.com', password: 'user123', role: 'User' },
];

const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
};

const getMe = (req, res) => {
  // User is injected by authMiddleware
  res.json({ user: req.user });
};

module.exports = {
  login,
  getMe,
};
