import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { WishlistItem } from './types';

const wishlistCollection = collection(db, 'wishlist');

export async function saveWishlistItemToFirestore(item: WishlistItem): Promise<void> {
    const ref = doc(wishlistCollection, item.id);
    await setDoc(ref, item);
}

export async function deleteWishlistItemFromFirestore(id: string): Promise<void> {
    const ref = doc(wishlistCollection, id);
    await deleteDoc(ref);
}

export async function loadWishlistItemsFromFirestore(): Promise<WishlistItem[]> {
    const snapshot = await getDocs(wishlistCollection);
    return snapshot.docs.map(docSnap => docSnap.data() as WishlistItem);
}
