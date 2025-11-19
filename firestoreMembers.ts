import { doc, setDoc, getDoc, getDocs, collection, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import { Member } from './types';

const membersCollection = collection(db, 'members');

export async function saveMemberToFirestore(member: Member): Promise<void> {
  const ref = doc(membersCollection, member.id);
  await setDoc(ref, member);
}

export async function saveMultipleMembersToFirestore(members: Member[]): Promise<void> {
  const promises = members.map(member => saveMemberToFirestore(member));
  await Promise.all(promises);
}

export async function deleteMemberFromFirestore(memberId: string): Promise<void> {
  const ref = doc(membersCollection, memberId);
  await deleteDoc(ref);
}

export async function loadMembersFromFirestore(): Promise<Member[]> {
  const snapshot = await getDocs(membersCollection);
  return snapshot.docs.map(docSnap => docSnap.data() as Member);
}
