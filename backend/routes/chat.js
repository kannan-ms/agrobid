const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');

// Get chat history between two users
router.get('/history/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;
  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;
