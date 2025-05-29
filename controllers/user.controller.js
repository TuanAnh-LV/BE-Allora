// controllers/user.controller.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users.map(u => u.toSafeObject()));
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.toSafeObject());
};

exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.toSafeObject());
};

exports.updateUserById = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const targetUserId = parseInt(req.params.id);

  try {
    const user = await User.findByPk(targetUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { Username, Email, PhoneNumber, Address, Role } = req.body;

    if (Username && Username !== user.Username) {
      const exists = await User.findOne({ where: { Username } });
      if (exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.Username = Username;
    }

    if (Email) user.Email = Email;
    if (PhoneNumber) user.PhoneNumber = PhoneNumber;
    if (Address) user.Address = Address;

    if (Role) {
      if (isAdmin) {
        user.Role = Role;
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
    console.error(' Error updating user:', err);
    return res.status(500).json({ message: 'An error occurred while updating user information' });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await user.checkPassword(oldPassword, bcrypt);
  if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

  user.PasswordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};

exports.deleteUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy();
  res.json({ message: 'User deleted successfully' });
};
