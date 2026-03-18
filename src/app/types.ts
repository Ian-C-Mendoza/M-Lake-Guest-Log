export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  referral: string;
  signature: string;
  date: string;
  status?: "active" | "completed";
}

export interface StorageData {
  guests: Guest[];
  purposes: string[];
  referrals: string[];
  defaultPurpose: string | null; // NEW
  defaultReferral: string | null;
}
