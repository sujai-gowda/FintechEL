const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name || user.email.split('@')[0],
  status: user.status || 'ACTIVE',
});

module.exports = { sanitizeUser };
