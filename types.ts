
export interface Member {
  id: string;
  name: string;
  joinDate: string; // ISO string
  profilePicture?: string; // Base64 encoded image or URL
  fcmToken?: string; // Firebase Cloud Messaging token
  totalContributions: number;
  balance: number;
}

export interface Contribution {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD format
  amount: number;
}

export interface WishlistItem {
  id: string;
  memberId: string;
  itemName: string;
  price: number;
  createdAt: string; // ISO string
}
