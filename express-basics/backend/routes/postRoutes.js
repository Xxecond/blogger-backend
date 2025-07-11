const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      userId: req.user.id, // secure and user-specific
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get only the posts of the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
