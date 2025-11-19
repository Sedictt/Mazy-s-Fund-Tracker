import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Contribution } from './types';

const contributionsCollection = collection(db, 'contributions');

export async function saveContributionToFirestore(contribution: Contribution): Promise<void> {
  const ref = doc(contributionsCollection, contribution.id);
  await setDoc(ref, contribution);
}

export async function deleteContributionFromFirestore(id: string): Promise<void> {
  const ref = doc(contributionsCollection, id);
  await deleteDoc(ref);
}

export async function saveMultipleContributionsToFirestore(contributions: Contribution[]): Promise<void> {
  await Promise.all(contributions.map(saveContributionToFirestore));
}
