import React from 'react';
import { Bell, BriefcaseIcon, MessageSquare, DollarSign } from 'lucide-react';

interface Notification {
  id: string;
  type: 'message' | 'proposal' | 'payment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message',
    message: 'Jane Smith sent you a message about your project',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'proposal',
    title: 'Proposal accepted',
    message: 'Your proposal for Web Design Project was accepted',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment received',
    message: 'You received a payment of $350 for Mobile App UI Design',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System update',
    message: 'Jobistry will be undergoing maintenance on Friday',
    time: '2 days ago',
    read: true,
  },
];

const getIconForNotificationType = (type: string) => {
  switch (type) {
    case 'message':
      return <MessageSquare size={16} className="text-blue-500" />;
    case 'proposal':
      return <BriefcaseIcon size={16} className="text-green-500" />;
    case 'payment':
      return <DollarSign size={16} className="text-accent-500" />;
    default:
      return <Bell size={16} className="text-gray-500" />;
  }
};

const NotificationDropdown: React.FC = () => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <span className="text-xs text-primary-600 cursor-pointer hover:text-primary-700">
            Mark all as read
          </span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div>
            {mockNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getIconForNotificationType(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </div>
      
      <div className="p-3 text-center border-t border-gray-100">
        <a 
          href="/notifications" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationDropdown;