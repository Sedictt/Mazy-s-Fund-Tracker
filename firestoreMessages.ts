import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'member';
  message: string;
  timestamp: Date;
  profilePicture?: string;
}

const messagesCollection = collection(db, 'messages');

/**
 * Send a new message to the chat
 */
export const sendMessage = async (
  userName: string,
  userRole: 'admin' | 'member',
  message: string,
  profilePicture?: string
): Promise<void> => {
  try {
    await addDoc(messagesCollection, {
      userName,
      userRole,
      message: message.trim(),
      timestamp: Timestamp.now(),
      profilePicture: profilePicture || null,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time messages
 * Returns an unsubscribe function
 */
export const subscribeToMessages = (
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        userId: data.userId || '',
        userName: data.userName || 'Unknown User',
        userRole: data.userRole || 'member',
        message: data.message || '',
        timestamp: data.timestamp?.toDate() || new Date(),
        profilePicture: data.profilePicture,
      });
    });
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages:", error);
  });

  return unsubscribe;
};

/**
 * Delete a message (admin only)
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'messages', messageId));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
