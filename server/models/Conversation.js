// models/Conversation.js
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
