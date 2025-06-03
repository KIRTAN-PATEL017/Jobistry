// components/SidebarConversations.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

interface Conversation {
  id: string;
  participant: Participant;
  lastMessage: string;
  timestamp: string;
  unread: number;
  contractId: string;
}

interface Props {
  conversations: Conversation[];
  selected: Conversation | null;
  onSelect: (conversation: Conversation) => void;
}

const SidebarConversations: React.FC<Props> = ({ conversations, onSelect, selected }) => {
  return (
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
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full p-4 text-left hover:bg-gray-50 ${selected?.id === c.id ? 'bg-primary-50' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={c.participant?.avatar || '/default-avatar.png'}
                className="w-11 h-11 rounded-full object-cover"
                alt={c.participant?.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-lg truncate">{c.participant?.name}</h3>
                  <span className="text-xs text-gray-500">{c.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  {c.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarConversations;
