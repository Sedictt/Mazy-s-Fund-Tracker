import React, { useState } from 'react';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementsModal: React.FC<AnnouncementsModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const announcements = [
    {
      id: 1,
      date: 'November 27, 2025',
      title: 'Wishlist Feature is here',
      description: 'Personalize your group expenses and grab attention. Add items to a shared wishlist, track estimated costs, and collaborate on future purchases.',
      icon: '🎁',
      color: 'bg-[#8B5CF6]'
    },
    {
      id: 2,
      date: 'November 28, 2025',
      title: 'Never Miss a Beat 🔔',
      description: 'Stay in the loop! Enable push notifications by clicking the bell icon 🔔 in the chatbox to get real-time alerts for new messages, even when you\'re away.',
      icon: '🔔',
      color: 'bg-blue-500'
    }
  ];

  if (!isOpen) return null;

  const currentAnnouncement = announcements[currentIndex];
  const isLast = currentIndex === announcements.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">

        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md w-full">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Top Image Section */}
          <div className={`${currentAnnouncement.color} h-64 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500`}>
            {/* Abstract Shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-black rounded-full blur-2xl"></div>
            </div>

            {/* Central Graphic */}
            <div className="relative z-10 transform transition-transform hover:scale-105 duration-500">
              <div className="bg-white p-6 rounded-3xl shadow-2xl">
                <span className="text-6xl">{currentAnnouncement.icon}</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 pt-8 pb-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              {currentAnnouncement.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-8 min-h-[80px]">
              {currentAnnouncement.description}
            </p>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {announcements.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? `w-8 ${currentAnnouncement.color.replace('bg-', 'bg-')}` : 'w-2 bg-gray-300'}`}
                ></div>
              ))}
            </div>

            {/* Main CTA */}
            <button
              onClick={handleNext}
              className={`w-full text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4 ${currentAnnouncement.color} hover:opacity-90`}
            >
              {isLast ? "Got it!" : "Next"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsModal;

