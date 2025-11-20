import React, { useState } from 'react';
import Card from './common/Card';
import ConfirmationModal from './common/ConfirmationModal';
import { uploadProfilePictureBase64 } from '../utils/imageUploadBase64';

interface MemberProfileSettingsProps {
  currentUsername: string;
  displayName: string;
  profilePicture?: string;
  onUpdateProfile: (displayName: string, profilePicture?: string) => void;
  onUpdateCredentials: (newUsername: string, newPassword: string) => void;
  onClose: () => void;
}

const MemberProfileSettings: React.FC<MemberProfileSettingsProps> = ({
  currentUsername,
  displayName,
  profilePicture,
  onUpdateProfile,
  onUpdateCredentials,
  onClose
}) => {
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState<string | undefined>(profilePicture);
  const [isUploading, setIsUploading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const base64Image = await uploadProfilePictureBase64('temp', file);
      setNewProfilePicture(base64Image);
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    setNewProfilePicture(undefined);
    setShowRemoveConfirm(false);
    setSuccess('Profile picture removed!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveProfile = () => {
    if (newDisplayName.trim() === '') {
      setError('Display name cannot be empty');
      return;
    }
    onUpdateProfile(newDisplayName.trim(), newProfilePicture);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveCredentials = () => {
    setError('');

    if (newUsername.trim() === '') {
      setError('Username cannot be empty');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    onUpdateCredentials(newUsername.trim(), newPassword || currentPassword);
    setSuccess('Login credentials updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Profile Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </h3>

            {/* Profile Picture */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                {newProfilePicture ? (
                  <img
                    src={newProfilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-violet-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-violet-200 flex items-center justify-center border-4 border-violet-300">
                    <span className="text-3xl font-bold text-violet-700">
                      {newDisplayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors cursor-pointer text-sm font-medium">
                    {isUploading ? 'Uploading...' : 'Change Picture'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {newProfilePicture && (
                    <button
                      onClick={() => setShowRemoveConfirm(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Remove Picture
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Your display name"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors"
            >
              Save Profile
            </button>
          </div>

          {/* Login Credentials Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Login Credentials
            </h3>

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Your username"
              />
              <p className="mt-1 text-xs text-gray-500">Current: {currentUsername}</p>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                placeholder="Leave blank to keep current password"
              />
            </div>

            {/* Confirm Password */}
            {newPassword && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Confirm your new password"
                />
              </div>
            )}

            <button
              onClick={handleSaveCredentials}
              className="px-6 py-2 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors"
            >
              Update Credentials
            </button>
          </div>
        </div>
      </Card>

      {/* Remove Picture Confirmation */}
      {showRemoveConfirm && (
        <ConfirmationModal
          isOpen={showRemoveConfirm}
          onClose={() => setShowRemoveConfirm(false)}
          onConfirm={handleRemoveProfilePicture}
          title="Remove Profile Picture?"
          message="Are you sure you want to remove your profile picture?"
        />
      )}
    </div>
  );
};

export default MemberProfileSettings;
