import React, { useState } from 'react';
import { Search, Send, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    lastMessage: 'That sounds great! I\'ll send you the details.',
    timestamp: '2 min ago',
    unread: 2
  },
  {
    id: '2',
    participant: {
      id: '3',
      name: 'Michael Chen'
    },
    lastMessage: 'When can you start the project?',
    timestamp: '1 hour ago',
    unread: 0
  },
  // Add more conversations as needed
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi, I saw your project posting and I\'m interested in helping you out.',
    sender: {
      id: '1',
      name: 'You'
    },
    timestamp: '2:30 PM',
    read: true
  },
  {
    id: '2',
    content: 'Thanks for reaching out! Could you tell me more about your experience with similar projects?',
    sender: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    timestamp: '2:32 PM',
    read: true
  },
  // Add more messages as needed
];

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Send message logic would go here
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {conversation.participant.avatar ? (
                  <img
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-lg truncate">
                      {conversation.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                {mockConversations.find(c => c.id === selectedConversation)?.participant.avatar ? (
                  <img
                    src={mockConversations.find(c => c.id === selectedConversation)?.participant.avatar}
                    alt={mockConversations.find(c => c.id === selectedConversation)?.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <h2 className="font-medium text-2xl">
                  {mockConversations.find(c => c.id === selectedConversation)?.participant.name}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === '1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender.id === '1'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className={`text-xs ${
                      message.sender.id === '1' ? 'text-primary-100' : 'text-gray-500'
                    } block mt-1`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input flex-1"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;