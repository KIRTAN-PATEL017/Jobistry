import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Message {
  _id: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: string;
  read: boolean;
  conversation: string;
}

interface Participant {
  _id: string;
  name: string;
  email: string;
  role: string; // Or 'freelancer' | 'client'
  avatar?: string;
}

interface Conversation {
  _id: string;
  contractId: string;
  participants: Participant[];
  lastMessage?: string;
  updatedAt?: string;
  __v?: number;
  unread?: number;
  timestamp?: string;
}

const Messages: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const res = await axios.get('/api/messages/conversations', { withCredentials: true });
        if (Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          console.error('Unexpected conversation response:', res.data);
          setConversations([]);
        }
      } catch (err) {
        console.error('Error fetching conversations', err);
        setConversations([]);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        setIsLoadingMessages(true);
        try {
          const res = await axios.get(`/api/messages/${selectedConversation}`, { withCredentials: true });
          setMessages(res.data);
          socket?.emit('joinRoom', { conversationId: selectedConversation });
        } catch (err) {
          console.error('Error fetching messages', err);
          setMessages([]);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      if (message.conversation === selectedConversation) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const recipient = getOtherUserId();

    socket?.emit('sendMessage', {
      conversationId: selectedConversation,
      sender: user?.id,
      recipient,
      content: newMessage,
    });

    setNewMessage('');
  };

  const getOtherUserId = (): string => {
    const convo = conversations.find(c => c._id === selectedConversation);
    return convo?.participants.find(p => p._id !== user?.id)?._id || '';
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
              className="input pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="p-4 text-center text-gray-500">Loading conversations...</div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setSelectedConversation(conversation._id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation._id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {conversation.participants[(user?.role === "freelancer") ? 0 : 1]?.avatar ? (
                    <img
                      src={conversation.participants[(user?.role === "freelancer") ? 1 : 0]?.avatar}
                      alt={conversation.participants[(user?.role === "freelancer") ? 1 : 0]?.name}
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
                        {conversation.participants[(user?.role === "freelancer") ? 1 : 0]?.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && conversation.unread > 0 && (
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-200 via-gray-200 to-gray-100">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                {conversations.find(c => c._id === selectedConversation)?.participants?.[(user?.role === "freelancer") ? 1 : 0]?.avatar ? (
                  <img
                    src={conversations.find(c => c._id === selectedConversation)?.participants[(user?.role === "freelancer") ? 1 : 0].avatar}
                    alt={conversations.find(c => c._id === selectedConversation)?.participants[(user?.role === "freelancer") ? 1 : 0].name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <h2 className="font-medium text-2xl">
                  {conversations.find(c => c._id === selectedConversation)?.participants[(user?.role === "freelancer") ? 1 : 0].name}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === user?.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className={`text-xs ${
                        message.sender === user?.id ? 'text-primary-100' : 'text-gray-500'
                      } block mt-1`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
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
                  disabled={isLoadingMessages}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newMessage.trim() || isLoadingMessages}
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
