import React, { useState } from 'react';
import Modal from './common/Modal';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcements = [
    {
      id: 1,
      date: 'November 20, 2025',
      title: 'Group Chat Feature 💬',
      description: 'Stay connected with everyone! Real-time group chat for all members and admin. Click the chat icon in the header to start messaging.',
      type: 'new' as const
    },
    {
      id: 2,
      date: 'November 20, 2025',
      title: 'Login System with Role-Based Access 🔐',
      description: 'New authentication system! Admin (Mazy) has full management access, while members have read-only view with personal profile management.',
      type: 'new' as const
    },
    {
      id: 3,
      date: 'November 20, 2025',
      title: 'Member Self-Service Portal 👤',
      description: 'Members can now manage their own profiles! Update display name, change profile picture, and modify login credentials through the settings menu.',
      type: 'new' as const
    },
    {
      id: 4,
      date: 'November 20, 2025',
      title: 'Stay Logged In Feature ✅',
      description: 'Check "Stay logged in" at login to automatically sign in on your next visit. Your session persists until you manually log out.',
      type: 'new' as const
    },
    {
      id: 5,
      date: 'November 20, 2025',
      title: 'Member Summary Dashboard 📊',
      description: 'Members can now view their contribution summary, balance, and see all other members\' totals in a clean, organized interface.',
      type: 'new' as const
    },
    {
      id: 6,
      date: 'November 20, 2025',
      title: 'Profile Pictures 📸',
      description: 'Upload and manage profile pictures with automatic compression. Images are optimized to 200x200px for fast loading.',
      type: 'improvement' as const
    },
    {
      id: 7,
      date: 'November 20, 2025',
      title: 'Mobile Navigation Improved 📱',
      description: 'Enhanced mobile experience with smooth sliding sidebar menu, better touch interactions, and responsive design throughout.',
      type: 'improvement' as const
    },
    {
      id: 8,
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  const currentAnnouncement = announcements[currentIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What's New" icon={icon}>
      <div className="mt-4">
        {/* Carousel Container with External Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 bg-white hover:bg-violet-50 text-violet-600 rounded-full p-2 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Previous announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel Card */}
          <div className="flex-1 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 sm:p-8 shadow-lg min-h-[280px] flex flex-col">
            {/* Card Content */}
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(currentAnnouncement.type)}`}>
                  {getTypeLabel(currentAnnouncement.type)}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                {currentAnnouncement.title}
              </h3>
              <p className="text-base text-gray-700 mb-4 leading-relaxed">
                {currentAnnouncement.description}
              </p>
              <p className="text-sm text-gray-500 font-medium">{currentAnnouncement.date}</p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 bg-white hover:bg-violet-50 text-violet-600 rounded-full p-2 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Next announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                index === currentIndex 
                  ? 'w-8 bg-violet-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 font-medium">
            {currentIndex + 1} of {announcements.length}
          </p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-violet-50 rounded-lg">
        <p className="text-sm text-violet-800 leading-relaxed">
          <strong>💡 Tip:</strong> Check back here regularly for new features and updates!
        </p>
      </div>
    </Modal>
  );
};

export default AnnouncementsModal;
