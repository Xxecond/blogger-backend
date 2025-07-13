const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email verification endpoint (POST)
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Verification token is required"
    });
  }

  try {
    // Find user with valid, unexpired token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
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
      message: "Internal server error during verification"
    });
  }
});

// Resend verification email endpoint (POST)
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Generate new token and expiry
    const newToken = crypto.randomBytes(32).toString("hex");
    const newExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = newToken;
    user.verificationTokenExpiry = newExpiry;
    await user.save();

    // Send new verification email
    const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${newToken}`;
    
    await transporter.sendMail({
      from: `"Blogger App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New Verification Request</h2>
          <p>Click below to verify your email:</p>
          <a href="${verifyUrl}"
            style="display: inline-block; padding: 12px 24px; 
                   background: #2563eb; color: white; 
                   text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
          <p style="margin-top: 20px; color: #666;">
            This link expires in 24 hours.
          </p>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: "New verification email sent"
    });

  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email"
    });
  }
});

module.exports = router;