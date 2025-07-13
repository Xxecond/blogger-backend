const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email regex for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Signup route
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

    const verifyLink = `${process.env.CLIENT_URL}/#/verifyEmail?token=${verificationToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hi there,</p>
        <p>Please click the button below to verify your email:</p>
        <p><a href="${verifyLink}" style="padding: 10px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p>${verifyLink}</p>
      `,
    });

    res.status(200).json({ message: "Signup successful! Please check your email to verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST verification route (for "Yes, it's me" button)
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;
  console.log("Verification token received:", token); // 👈 DEBUG LOG

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      console.log("Invalid or expired token."); // 👈 DEBUG LOG
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    console.log("User after verification:", user); // 👈 DEBUG LOG

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification error:", err); // 👈 DEBUG LOG
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login route
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
