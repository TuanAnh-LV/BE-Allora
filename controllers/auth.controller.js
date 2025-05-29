const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const admin = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

// Register a new account
exports.register = async (req, res) => {
  const { Username, Password, Email, PhoneNumber, Address } = req.body;

  try {
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(Password, 10);
    const token = uuidv4();

    const newUser = await User.create({
      Username,
      PasswordHash: hash,
      Email,
      PhoneNumber,
      Address,
      Role: 'customer',
      IsVerified: false,
      VerifyToken: token,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
      <p>Hello ${Username},</p>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `;

    await sendEmail(Email, 'SalesApp Email Verification', html);

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('🔥 Error creating user or sending email:', err.message);
    return res.status(500).json({ message: 'An error occurred during registration.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ where: { Email } });
    if (!user) return res.status(404).json({ message: 'Account not found' });

    const match = await bcrypt.compare(Password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    if (!user.IsVerified) {
      return res.status(403).json({ message: 'Email has not been verified yet.' });
    }

    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Google login
exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;
  try {
    // Verify token with Firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decoded;

    let user = await User.findOne({ where: { Email: email } });

    if (!user) {
      user = await User.create({
        Username: name || email.split('@')[0],
        Email: email,
        Role: 'customer',
        IsVerified: true,
        PasswordHash: 'GOOGLE', // Placeholder
      });
    }

    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Google login successful', token });
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

// Logout (client-side only)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully (client should remove token)' });
};

// Email verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ where: { VerifyToken: token } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.IsVerified = true;
  user.VerifyToken = null;
  await user.save();

  res.json({ message: 'Email verified successfully. You can now log in.' });
};
