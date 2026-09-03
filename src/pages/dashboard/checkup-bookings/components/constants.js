export const CHECKUP_STATUSES = [
  "Booked",
  "Sample Collected",
  "Report Ready",
  "Postponed",
  "Cancelled",
  "No Show",
];

export const INLINE_STATUSES = CHECKUP_STATUSES.filter((s) => s !== "Postponed");

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
];

export const PAYMENT_STATUSES = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

// Collection slots the patient-facing site offers: every 30 minutes from 7:00,
// last one at 10:00, which closes the 7:00 AM - 10:30 AM window it advertises.
// The admin picker is limited to these so a booking can never be moved to a
// time patients can't book themselves.
export const COLLECTION_SLOTS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
];

// The site shows today plus the next six days, with today itself not bookable.
export const COLLECTION_DAYS = 7;

export const isOfferedSlot = (time) => COLLECTION_SLOTS.includes(time);

export const COLLECTION_TYPES = [
  { value: "hospital", label: "Hospital visit", disabled: false },
  { value: "home", label: "Home collection", disabled: true },
];

export const modeHasReference = (mode) =>
  ["upi", "card", "icici"].includes(String(mode || "").toLowerCase());

export const MODE_LABEL = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  icici: "Online (ICICI)",
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "Report Ready":
      return "bg-green-100 text-green-700 border-green-200";
    case "Sample Collected":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Booked":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Postponed":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "No Show":
      return "bg-gray-200 text-gray-700 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getPaymentBadgeColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
};

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Slots are stored 24h ("08:30") — show them the way reception reads them.
export const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = String(time).split(":").map(Number);
  if (isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m || 0).padStart(2, "0")} ${suffix}`;
};

// Local YYYY-MM-DD — toISOString() would shift the date backwards in IST.
export const toLocalDateStr = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
