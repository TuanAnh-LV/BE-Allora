const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  User  = require('../models/user.model');
const admin = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

// Register a new account
exports.register = async (req, res) => {
  const { username, password, email, phoneNumber, address } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = uuidv4();

    const newUser = await User.create({
      username,
      password_hash: hash,
      email,
      phone_number: phoneNumber,
      address,
      role: 'customer',
      is_verified: false,
      verify_token: token,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
      <p>Hello ${username},</p>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `;

    await sendEmail(email, 'SalesApp Email Verification', html);
    console.log('🧪 New user raw:', newUser);
console.log('🧪 Has toSafeObject():', typeof newUser.toSafeObject);

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: newUser.toSafeObject(),
    });
  } catch (err) {
    console.error('🔥 Error creating user or sending email:', err.message);
    return res.status(500).json({ message: 'An error occurred during registration.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Account not found' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Email has not been verified yet.' });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Google login
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decoded;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        username: name || email.split('@')[0],
        email,
        role: 'customer',
        is_verified: true,
        password_hash: 'GOOGLE', // Not used
      });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token', error: error.message });
  }
};

// Get current logged-in user info
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info', error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully (client should remove token)' });
};

// Email verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ where: { verify_token: token } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.is_verified = true;
  user.verify_token = null;
  await user.save();

  res.json({ message: 'Email verified successfully. You can now log in.' });
};
