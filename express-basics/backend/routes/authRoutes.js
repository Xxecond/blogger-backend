const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// Email transporter (configured for Gmail)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Signup with email verification
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid email format" 
    });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Hash password and generate verification token
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      verified: false
    });

    await newUser.save();

    // Generate verification link
    const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: `"Blogger App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Welcome to Blogger App!</h2>
          <p>Click below to verify your email:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; 
                    background-color: #2563eb; color: white; 
                    text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
          <p style="margin-top: 20px;">
            <small>If you didn't request this, please ignore this email.</small>
          </p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: "Signup successful! Check your email for verification."
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup"
    });
  }
});

// Email Verification (GET - for email links)
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.redirect(
      `${process.env.CLIENT_URL}/login?verified=false&error=missing_token`
    );
  }

  try {
    // Find user with valid token
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?verified=false&error=invalid_token`
      );
    }

    // Mark as verified
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to frontend with success
    res.redirect(
      `${process.env.CLIENT_URL}/login?verified=true&email=${encodeURIComponent(user.email)}`
    );

  } catch (error) {
    console.error("Verification error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/login?verified=false&error=server_error`
    );
  }
});

// Manual Verification (POST - for frontend)
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Verification token required"
    });
  }

  try {
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      email: user.email
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification"
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check verification status
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first"
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});

module.exports = router;