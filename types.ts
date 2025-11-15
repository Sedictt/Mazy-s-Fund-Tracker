
export interface Member {
  id: string;
  name: string;
  joinDate: string; // ISO string
}

export interface Contribution {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD format
  amount: number;
}
