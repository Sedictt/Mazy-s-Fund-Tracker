import React from 'react';
import Modal from './common/Modal';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose }) => {
  const announcements = [
    {
      id: 1,
      date: 'November 20, 2025',
      title: 'Login System with Role-Based Access �',
      description: 'New authentication system! Admin (Mazy) has full management access, while members have read-only view with personal profile management.',
      type: 'new' as const
    },
    {
      id: 2,
      date: 'November 20, 2025',
      title: 'Member Self-Service Portal 👤',
      description: 'Members can now manage their own profiles! Update display name, change profile picture, and modify login credentials through the settings menu.',
      type: 'new' as const
    },
    {
      id: 3,
      date: 'November 20, 2025',
      title: 'Stay Logged In Feature ✅',
      description: 'Check "Stay logged in" at login to automatically sign in on your next visit. Your session persists until you manually log out.',
      type: 'new' as const
    },
    {
      id: 4,
      date: 'November 20, 2025',
      title: 'Member Summary Dashboard �',
      description: 'Members can now view their contribution summary, balance, and see all other members\' totals in a clean, organized interface.',
      type: 'new' as const
    },
    {
      id: 5,
      date: 'November 20, 2025',
      title: 'Profile Pictures 📸',
      description: 'Upload and manage profile pictures with automatic compression. Images are optimized to 200x200px for fast loading.',
      type: 'improvement' as const
    },
    {
      id: 6,
      date: 'November 20, 2025',
      title: 'Mobile Navigation Improved 📱',
      description: 'Enhanced mobile experience with smooth sliding sidebar menu, better touch interactions, and responsive design throughout.',
      type: 'improvement' as const
    },
    {
      id: 7,
      date: 'November 20, 2025',
      title: 'Data Table Bug Fixed 🐛',
      description: 'Fixed an issue where editing contributions could create duplicate entries. Total contributions now calculate correctly.',
      type: 'fix' as const
    }
  ];

  const getTypeColor = (type: 'new' | 'improvement' | 'fix') => {
    switch (type) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'fix':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: 'new' | 'improvement' | 'fix') => {
    switch (type) {
      case 'new':
        return 'New Feature';
      case 'improvement':
        return 'Improvement';
      case 'fix':
        return 'Bug Fix';
      default:
        return 'Update';
    }
  };

  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What's New" icon={icon}>
      <div className="mt-4 space-y-3 sm:space-y-4 max-h-96 overflow-y-auto px-1">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1">{announcement.title}</h3>
              <span className={`self-start px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTypeColor(announcement.type)}`}>
                {getTypeLabel(announcement.type)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{announcement.description}</p>
            <p className="text-xs text-gray-500">{announcement.date}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-violet-50 rounded-lg">
        <p className="text-xs sm:text-sm text-violet-800 leading-relaxed">
          <strong>💡 Tip:</strong> Check back here regularly for new features and updates!
        </p>
      </div>
    </Modal>
  );
};

export default AnnouncementsModal;
