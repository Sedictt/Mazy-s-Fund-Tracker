import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Member } from './types';

// Hardcoded credentials for migration purposes (legacy)
const legacyCredentials = [
  { username: 'bryan', password: 'bryan123', displayName: 'Bryan' },
  { username: 'deign', password: 'deign123', displayName: 'Deign' },
  { username: 'jv', password: 'jv123', displayName: 'Jv' },
  { username: 'lorraine', password: 'lorraine123', displayName: 'Lorraine' },
  { username: 'margaux', password: 'margaux123', displayName: 'Margaux' },
  { username: 'raineer', password: 'raineer123', displayName: 'Raineer' },
  { username: 'sean', password: 'sean123', displayName: 'Sean' },
  { username: 'mark', password: 'mark123', displayName: 'Mark' },
];

export const validateMemberCredentials = async (username: string, password: string): Promise<Member | null> => {
  try {
    const membersRef = collection(db, 'members');
    const q = query(membersRef, where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Member;
    }
    return null;
  } catch (error) {
    console.error("Error validating credentials:", error);
    return null;
  }
};

export const isAdminCredentials = (username: string, password: string): boolean => {
  return username.toLowerCase() === 'mazy' && password === 'mazy123';
};

export const updateMemberCredentials = async (
  memberId: string,
  newUsername?: string,
  newPassword?: string
): Promise<boolean> => {
  try {
    const memberRef = doc(db, 'members', memberId);
    const updates: any = {};
    if (newUsername) updates.username = newUsername;
    if (newPassword) updates.password = newPassword;

    await updateDoc(memberRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating credentials:", error);
    return false;
  }
};

// One-time migration function to be called from App.tsx
export const migrateLegacyCredentials = async (members: Member[]) => {
  for (const member of members) {
    if (!member.username || !member.password) {
      const legacy = legacyCredentials.find(c => c.displayName.toLowerCase() === member.name.toLowerCase());
      if (legacy) {
        console.log(`Migrating credentials for ${member.name}...`);
        await updateMemberCredentials(member.id, legacy.username, legacy.password);
      } else {
        // Assign default credentials for members without legacy ones
        // Default: username = lowercase name, password = lowercase name + '123'
        const defaultUsername = member.name.toLowerCase().replace(/\s+/g, '');
        const defaultPassword = `${defaultUsername}123`;
        console.log(`Assigning default credentials for ${member.name}...`);
        await updateMemberCredentials(member.id, defaultUsername, defaultPassword);
      }
    }
  }
};
