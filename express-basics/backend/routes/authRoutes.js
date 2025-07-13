const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// ✅ Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ SIGNUP route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    await newUser.save();

    const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Blogger App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome to Blogger App</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verifyUrl}" style="padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If that doesn't work, copy and paste this URL:</p>
        <code>${verifyUrl}</code>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful! Check your email for verification.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// ✅ GET Verify route (clicked from email)
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.redirect(`${process.env.CLIENT_URL}/#/login?verified=false&error=missing_token`);
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/#/login?verified=false&error=invalid_token`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/#/login?verified=true`);
  } catch (error) {
    console.error("GET verify error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/#/login?verified=false&error=server_error`);
  }
});

// ✅ POST Verify route (optional - used by "Yes it's me" button)
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token required" });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified", email: user.email });
  } catch (error) {
    console.error("POST verify error:", error);
    res.status(500).json({ success: false, message: "Verification error" });
  }
});

// ✅ LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

module.exports = router;
