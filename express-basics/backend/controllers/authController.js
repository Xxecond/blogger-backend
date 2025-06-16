const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Account created successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', success: false });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials', success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials', success: false });

    res.json({ message: 'Login successful', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', success: false });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.tokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
      }
    });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: 'Password reset link sent to your email', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', success: false });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token', success: false });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', success: false });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword };
