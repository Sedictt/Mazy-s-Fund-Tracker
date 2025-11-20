import React, { useState } from 'react';
import { Member } from '../types';
import Card from './common/Card';
// Temporarily use base64 until Firebase Storage is configured
import { uploadProfilePictureBase64 as uploadProfilePicture } from '../utils/imageUploadBase64';

interface MembersPageProps {
  members: Member[];
  onUpdateMember: (id: string, name: string, profilePicture?: string) => void;
  onDeleteMember: (member: Member) => void;
  onAddMember: (name: string) => void;
}

const MembersPage: React.FC<MembersPageProps> = ({ 
  members, 
  onUpdateMember, 
  onDeleteMember,
  onAddMember 
}) => {
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const handleStartEdit = (member: Member) => {
    setEditingMember(member.id);
    setEditName(member.name);
  };

  const handleSaveEdit = (memberId: string) => {
    if (editName.trim()) {
      onUpdateMember(memberId, editName.trim());
      setEditingMember(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditName('');
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const handleImageUpload = async (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(memberId);
        
        // Upload to Firebase Storage
        const downloadURL = await uploadProfilePicture(memberId, file);
        
        // Update member with the new profile picture URL
        const member = members.find(m => m.id === memberId);
        if (member) {
          onUpdateMember(memberId, member.name, downloadURL);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Members</h2>
          
          {/* Add New Member */}
          <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Add New Member</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                placeholder="Enter member name"
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base"
              />
              <button
                onClick={handleAddMember}
                className="px-4 sm:px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
              >
                Add Member
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3 sm:space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Profile Picture and Basic Info - Mobile Layout */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Profile Picture */}
                  <div className="relative group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-violet-200 flex items-center justify-center font-bold text-violet-700 text-lg sm:text-xl overflow-hidden">
                      {uploadingImage === member.id ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-700"></div>
                      ) : member.profilePicture ? (
                        <img 
                          src={member.profilePicture} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {uploadingImage !== member.id && (
                      <label 
                        htmlFor={`upload-${member.id}`}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                    )}
                    <input
                      id={`upload-${member.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(member.id, e)}
                      className="hidden"
                      disabled={uploadingImage === member.id}
                    />
                  </div>

                  {/* Member Info */}
                  {editingMember === member.id ? (
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(member.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{member.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Joined: {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                {editingMember === member.id ? (
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <button
                      onClick={() => handleSaveEdit(member.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-end sm:justify-start">
                    <button
                      onClick={() => handleStartEdit(member)}
                      className="p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                      title="Edit member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteMember(member)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <p className="text-base sm:text-lg">No members yet. Add your first member above!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MembersPage;
