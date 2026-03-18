// utils/guests.ts
export interface GuestRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  purpose: string;
  checkIn: string;
  checkOut?: string;
  status: "active" | "checked-out";
}

export const getGuests = (): GuestRecord[] => {
  return JSON.parse(localStorage.getItem("guests") || "[]");
};

export const exportGuestsToCSV = (): string => {
  const guests = getGuests();
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Purpose",
    "Check In",
    "Check Out",
    "Status",
  ];
  const rows = guests.map((g) => [
    g.name,
    g.email || "",
    g.phone || "",
    g.purpose,
    g.checkIn,
    g.checkOut || "",
    g.status,
  ]);
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};
