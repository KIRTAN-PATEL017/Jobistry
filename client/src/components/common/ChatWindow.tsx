// components/ChatWindow.tsx
import React from 'react';
import { Send } from 'lucide-react';

interface Sender {
  id: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: Sender;
}

interface Props {
  messages: Message[];
  onSend: (e: React.FormEvent) => void;
  contractId?: string;
  newMessage: string;
  setNewMessage: (value: string) => void;
}

const ChatWindow: React.FC<Props> = ({
  messages,
  onSend,
  newMessage,
  setNewMessage,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender.id === '1' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${m.sender.id === '1' ? 'bg-primary-500 text-white' : 'bg-white'}`}>
              <p>{m.content}</p>
              <span className={`text-xs ${m.sender.id === '1' ? 'text-primary-100' : 'text-gray-500'} block mt-1`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
