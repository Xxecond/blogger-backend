const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// Forgot & Reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
