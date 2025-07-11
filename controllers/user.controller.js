const  User  = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users.map(u => u.toSafeObject()));
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.toSafeObject());
};

// Get current logged-in user
exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.toSafeObject());
};

// Update user (self or admin)
exports.updateUserById = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const targetUserId = parseInt(req.params.id);

  try {
    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email, phoneNumber, address, role } = req.body;

    if (username && username !== user.username) {
      const exists = await User.findOne({ where: { username } });
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = username;
    }

    if (email) user.email = email;
    if (phoneNumber) user.phone_number = phoneNumber;
    if (address) user.address = address;

    if (role) {
      if (isAdmin) {
        user.role = role;
      } else {
        return res.status(403).json({ message: 'You are not allowed to change the role.' });
      }
    }

    await user.save();
    return res.json({
      message: 'User information updated successfully',
      user: user.toSafeObject()
    });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ message: 'An error occurred while updating user information' });
  }
};

// Change password (self only)
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await user.checkPassword(oldPassword, bcrypt);
  if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

  user.password_hash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

// Delete user
exports.deleteUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy();
  res.json({ message: 'User deleted successfully' });
};
