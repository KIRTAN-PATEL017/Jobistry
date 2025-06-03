import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const getMessagesByContract = async (req, res) => {
  const { contractId } = req.params;
  try {
    // 1. Find the conversation associated with this contract
    const conversation = await Conversation.findOne({ contract: contractId });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // 2. Fetch all messages in the conversation
    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 }); // oldest to newest

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
