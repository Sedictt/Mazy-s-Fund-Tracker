import React, { useState, useEffect, useRef } from 'react';
import Card from './common/Card';
import { ChatMessage, sendMessage, subscribeToMessages, deleteMessage } from '../firestoreMessages';
import { requestNotificationPermission } from '../utils/notifications';
import Modal from './common/Modal';

interface GroupChatProps {
  currentUser: string;
  currentUserId: string;
  userRole: 'admin' | 'member';
  userProfilePicture?: string;
  onClose: () => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ currentUser, currentUserId, userRole, userProfilePicture, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [notificationModal, setNotificationModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    setIsSending(true);
    try {
      await sendMessage(currentUser, userRole, newMessage, userProfilePicture);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
        date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-violet-50 rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">Group Chat</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">All members • {messages.length} messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const handlePermission = async () => {
                  try {
                    if (currentUserId) {
                      await requestNotificationPermission(currentUserId);
                      setNotificationModal({
                        isOpen: true,
                        title: 'Notifications Enabled',
                        message: "You're all set! You'll now receive updates on this device.",
                        type: 'success'
                      });
                    } else {
                      // Fallback
                      if ('Notification' in window) {
                        const permission = await Notification.requestPermission();
                        if (permission === 'granted') {
                          setNotificationModal({
                            isOpen: true,
                            title: 'Notifications Enabled',
                            message: "You're all set! You'll now receive updates on this device.",
                            type: 'success'
                          });
                        } else {
                          setNotificationModal({
                            isOpen: true,
                            title: 'Notifications Blocked',
                            message: "We couldn't turn on notifications. Please check your browser settings to allow them.",
                            type: 'error'
                          });
                        }
                      }
                    }
                  } catch (error) {
                    console.error("Error requesting permission:", error);
                    setNotificationModal({
                      isOpen: true,
                      title: 'Something went wrong',
                      message: "We couldn't turn on notifications right now. Please try again later.",
                      type: 'error'
                    });
                  }
                };
                handlePermission();
              }}
              className="p-1.5 sm:p-2 rounded-md text-violet-600 hover:bg-violet-50 transition-colors"
              title="Enable Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mb-3 sm:mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-base sm:text-lg font-medium text-center">No messages yet</p>
              <p className="text-xs sm:text-sm text-center mt-1">Be the first to say hello! 👋</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.userName === currentUser;
              const isAdmin = msg.userRole === 'admin';
              const displayName = msg.userName || 'Unknown';
              const avatarInitial = displayName.charAt(0).toUpperCase();

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {msg.profilePicture ? (
                      <img
                        src={msg.profilePicture}
                        alt={displayName}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-violet-200"
                      />
                    ) : (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isAdmin ? 'bg-purple-200' : 'bg-violet-200'
                        }`}>
                        <span className={`text-xs sm:text-sm font-bold ${isAdmin ? 'text-purple-700' : 'text-violet-700'
                          }`}>
                          {avatarInitial}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[75%] sm:max-w-[70%] ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1" style={{ flexDirection: isCurrentUser ? 'row-reverse' : 'row' }}>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{displayName}</span>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 sm:px-2 bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-medium rounded-full flex-shrink-0">
                          Admin
                        </span>
                      )}
                      <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">{formatTime(msg.timestamp)}</span>
                    </div>

                    <div className="relative group">
                      <div className={`inline-block p-2 sm:p-3 rounded-lg ${isCurrentUser
                        ? 'bg-violet-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                      </div>

                      {/* Delete button (admin only) */}
                      {userRole === 'admin' && !isCurrentUser && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Delete message"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-lg flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isSending || newMessage.trim() === ''}
              className="px-4 sm:px-6 py-2 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed text-sm sm:text-base flex-shrink-0"
            >
              {isSending ? (
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="hidden sm:inline">Send</span>
              )}
              {!isSending && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* Notification Feedback Modal */}
      <Modal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
        title={notificationModal.title}
        zIndex="z-[60]"
        icon={
          notificationModal.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        }
      >
        <p className="text-sm text-gray-500">{notificationModal.message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setNotificationModal({ ...notificationModal, isOpen: false })}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GroupChat;
