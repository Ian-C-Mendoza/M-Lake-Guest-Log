import { Guest, StorageData } from "../types";

const STORAGE_KEY = "guest_registration_data";

const DEFAULT_PURPOSES = [
  "Inquiry",
  "Booking",
  "Check-in",
  "Ocular",
  "Meeting",
  "Official Business",
];

const DEFAULT_REFERRALS = [
  "Facebook",
  "Repeat Guest",
  "Social Media",
  "Friend/Colleague",
  "Advertisement",
  "Search Engine",
  "Other",
];

export const getStorageData = (): StorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all fields exist
      if (!parsed.hasOwnProperty("defaultPurpose")) {
        parsed.defaultPurpose = null;
      }
      if (!parsed.hasOwnProperty("referrals")) {
        parsed.referrals = DEFAULT_REFERRALS;
      }
      if (!parsed.hasOwnProperty("defaultReferral")) {
        parsed.defaultReferral = null;
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  return {
    guests: [],
    purposes: DEFAULT_PURPOSES,
    referrals: DEFAULT_REFERRALS,
    defaultPurpose: null,
    defaultReferral: null, // ✅ ADD THIS
  };
};

export const saveStorageData = (data: StorageData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveGuest = (guest: Guest): void => {
  const data = getStorageData();
  data.guests.push(guest);
  saveStorageData(data);
};
export const getGuests = (): Guest[] => {
  return getStorageData().guests.map((g) => ({
    ...g,
    status: g.status ?? "active", // ✅ fallback for old records
  }));
};

// Purpose Management
export const getPurposes = (): string[] => {
  return getStorageData().purposes;
};

export const savePurposes = (purposes: string[]): void => {
  const data = getStorageData();
  data.purposes = purposes;
  saveStorageData(data);
};

export const addPurpose = (purpose: string): void => {
  const purposes = getPurposes();
  if (!purposes.includes(purpose)) {
    purposes.push(purpose);
    savePurposes(purposes);
  }
};

export const updatePurpose = (oldPurpose: string, newPurpose: string): void => {
  const data = getStorageData();
  const index = data.purposes.indexOf(oldPurpose);
  if (index !== -1 && !data.purposes.includes(newPurpose)) {
    data.purposes[index] = newPurpose;

    // Update default if it was the old one
    if (data.defaultPurpose === oldPurpose) {
      data.defaultPurpose = newPurpose;
    }

    saveStorageData(data);
  }
};

export const deletePurpose = (purpose: string): void => {
  const data = getStorageData();
  data.purposes = data.purposes.filter((p) => p !== purpose);

  // Clear default if it was deleted
  if (data.defaultPurpose === purpose) {
    data.defaultPurpose = null;
  }

  saveStorageData(data);
};

// NEW: Default Purpose Functions
export const setDefaultPurpose = (purpose: string): void => {
  const data = getStorageData();
  data.defaultPurpose = purpose;
  saveStorageData(data);
};

export const getDefaultPurpose = (): string | null => {
  return getStorageData().defaultPurpose;
};

export const clearDefaultPurpose = (): void => {
  const data = getStorageData();
  data.defaultPurpose = null;
  saveStorageData(data);
};

// Helper: Get purposes with default first
export const getPurposesWithDefault = (): string[] => {
  const data = getStorageData();
  const { purposes, defaultPurpose } = data;

  if (!defaultPurpose || !purposes.includes(defaultPurpose)) {
    return purposes;
  }

  return [defaultPurpose, ...purposes.filter((p) => p !== defaultPurpose)];
};

// =========================
// REFERRAL MANAGEMENT
// =========================

export const getReferrals = (): string[] => {
  return getStorageData().referrals;
};

export const saveReferrals = (referrals: string[]): void => {
  const data = getStorageData();
  data.referrals = referrals;
  saveStorageData(data);
};

export const addReferral = (referral: string): void => {
  const referrals = getReferrals();
  if (!referrals.includes(referral)) {
    referrals.push(referral);
    saveReferrals(referrals);
  }
};

export const updateReferral = (
  oldReferral: string,
  newReferral: string,
): void => {
  const data = getStorageData();
  const index = data.referrals.indexOf(oldReferral);

  if (index !== -1 && !data.referrals.includes(newReferral)) {
    data.referrals[index] = newReferral;

    // Update default if it was the old one
    if (data.defaultReferral === oldReferral) {
      data.defaultReferral = newReferral;
    }

    saveStorageData(data);
  }
};

export const deleteReferral = (referral: string): void => {
  const data = getStorageData();
  data.referrals = data.referrals.filter((r) => r !== referral);

  // Clear default if it was deleted
  if (data.defaultReferral === referral) {
    data.defaultReferral = null;
  }

  saveStorageData(data);
};

// =========================
// DEFAULT REFERRAL FUNCTIONS
// =========================

export const setDefaultReferral = (referral: string): void => {
  const data = getStorageData();
  data.defaultReferral = referral;
  saveStorageData(data);
};

export const getDefaultReferral = (): string | null => {
  return getStorageData().defaultReferral;
};

export const clearDefaultReferral = (): void => {
  const data = getStorageData();
  data.defaultReferral = null;
  saveStorageData(data);
};

// Helper: Get referrals with default first
export const getReferralsWithDefault = (): string[] => {
  const data = getStorageData();
  const { referrals, defaultReferral } = data;

  if (!defaultReferral || !referrals.includes(defaultReferral)) {
    return referrals;
  }

  return [defaultReferral, ...referrals.filter((r) => r !== defaultReferral)];
};

export const exportGuestsToCSV = (): string => {
  const guests = getGuests();
  const headers = ["Name", "Email", "Phone", "Purpose", "Check In", "Status"];
  const rows = guests.map((g) => [
    g.name,
    g.email || "",
    g.phone || "",
    g.purpose,
    g.date,
    g.status || "active",
  ]);
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

export const checkoutGuest = (id: string) => {
  const data = getStorageData();

  data.guests = data.guests.map((guest) =>
    guest.id === id
      ? { ...guest, checkout: new Date().toISOString(), status: "completed" }
      : guest,
  );

  saveStorageData(data);
};
