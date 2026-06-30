const { readJSONFile, updateJSONFile } = require('../utils/storage');

const getUsers = (req, res) => {
  const users = [
    { id: 'admin', email: 'admin@escrow.com', role: 'Admin', status: 'ACTIVE' },
    { id: 'user1', email: 'user1@escrow.com', role: 'User', status: 'ACTIVE' },
    { id: 'user2', email: 'user2@escrow.com', role: 'User', status: 'ACTIVE' },
    { id: 'user3', email: 'user3@escrow.com', role: 'User', status: 'ACTIVE' }
  ];
  
  // Ideally this would come from users.json, but since we hardcoded them in auth controller,
  // we will just return them or read from a user file if we sync them. 
  // Let's assume we read from a users.json if we start using it.
  const storedUsers = readJSONFile('users');
  const allUsers = storedUsers.length > 0 ? storedUsers : users;

  res.json(allUsers);
};

const freezeUser = (req, res) => {
  const { id } = req.params;
  const storedUsers = readJSONFile('users');
  // For the hardcoded demo, we would need to ensure users.json is populated on start.
  // We can just update it if it exists.
  let user = storedUsers.find(u => u.id === id);
  if (!user) {
    // If not found in file, we might not be able to freeze hardcoded ones easily without 
    // writing them to the file first. We will simulate it.
    return res.status(404).json({ error: 'User not found in storage' });
  }

  updateJSONFile('users', id, { status: user.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN' });
  res.json({ message: `User status updated successfully` });
};

module.exports = {
  getUsers,
  freezeUser
};
