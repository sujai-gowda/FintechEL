const User = require('../models/User');
const { sanitizeUser } = require('../utils/userHelpers');

const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : { role: { $ne: 'Admin' } };

    const users = await User.find(query).select('-password');
    res.json(users.map(sanitizeUser));
  } catch (error) {
    console.error('GetUsers error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

const freezeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'Admin') {
      return res.status(403).json({ error: 'Cannot freeze admin accounts' });
    }

    user.status = user.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    await user.save();

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('FreezeUser error:', error);
    res.status(500).json({ error: 'Server error updating user status' });
  }
};

module.exports = {
  getUsers,
  freezeUser,
};
