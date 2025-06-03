import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// GET /api/messages/conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'name email avatar role') 
      .exec();

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching conversations', error: err.message });
  }
};

// GET /api/messages/:conversationId
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error while fetching messages.' });
  }
};

// Socket handler
export const createMessage = async (data, io) => {
  const { conversationId, sender, recipient, content } = data;

  try {
    const message = await Message.create({
      content,
      sender,
      recipient,
      conversation: conversationId,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    io.to(conversationId).emit('receiveMessage', message);
  } catch (err) {
    console.error('Error creating message:', err);
  }
};
