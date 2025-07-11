 const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email regex for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
    });

    res.status(200).json({ message: "Signup successful! Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email verification
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid or expired token.");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified successfully. You can now log in.");
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Verify your email before logging in" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
