import {
  exportRowsToExcel,
  toExcelDate,
  flattenAddress,
} from "@/lib/exportToExcel";
import { dedupeDoctorTitle } from "@/lib/formatText";

// Every field the admin can see for an appointment — the union of the table
// columns and the "View Details" modal. Where both show the same thing (name,
// gender, contact, department, doctor, date/time, amount, statuses) it appears
// once.
//
// Table only    : No.
// Modal only    : Date of Birth, Address, Payment Mode, Medical Issue Details,
//                 Created At, Last Updated
// Both          : the rest
const DATE_FMT = "dd-mmm-yyyy";
const DATETIME_FMT = "dd-mmm-yyyy hh:mm AM/PM";

// The table renders the slot as one cell; the export splits it into start/end
// so each is filterable on its own.
const formatSlotTime = (time) => {
  if (!time) return "";
  const [h, m] = String(time).split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return String(time);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
};

const APPOINTMENT_COLUMNS = [
  { header: "No.", width: 6, value: (_a, i) => i + 1 },

  // ── Patient ──
  {
    header: "Patient Name",
    width: 24,
    value: (a) => a.patientId?.patient_full_name || "",
  },
  {
    header: "Date of Birth",
    width: 14,
    numFmt: DATE_FMT,
    value: (a) => toExcelDate(a.patientId?.date_of_birth),
  },
  { header: "Gender", width: 10, value: (a) => a.patientId?.gender || "" },
  {
    header: "Contact Number",
    width: 16,
    value: (a) => a.patientId?.contact_number || "",
  },
  {
    header: "Address",
    width: 34,
    value: (a) => flattenAddress(a.patientId?.address),
  },

  // ── Appointment ──
  {
    header: "Department",
    width: 22,
    value: (a) => a.doctorId?.department || "",
  },
  {
    header: "Doctor",
    width: 24,
    value: (a) => dedupeDoctorTitle(a.doctorId?.fullName),
  },
  {
    header: "Appointment Date",
    width: 18,
    numFmt: DATE_FMT,
    value: (a) => toExcelDate(a.appointment_date || a.date),
  },
  {
    header: "Slot Start Time",
    width: 15,
    value: (a) => formatSlotTime(a.slot_start_time),
  },
  {
    header: "Slot End Time",
    width: 15,
    value: (a) => formatSlotTime(a.slot_end_time),
  },
  {
    header: "Appointment Status",
    width: 18,
    value: (a) => a.status || "",
  },

  // ── Payment ──
  {
    header: "Amount",
    width: 12,
    numFmt: "0.00",
    value: (a) => {
      const amount = a.amount ?? a.doctorId?.fees;
      const n = Number(amount);
      return amount === null || amount === undefined || isNaN(n) ? "" : n;
    },
  },
  { header: "Payment Status", width: 16, value: (a) => a.paymentStatus || "" },
  { header: "Payment Mode", width: 14, value: (a) => a.paymentMode || "" },

  // ── Additional ──
  {
    header: "Medical Issue Details",
    width: 50,
    value: (a) => a.medical_issue_details || "",
  },
  {
    header: "Created At",
    width: 20,
    numFmt: DATETIME_FMT,
    value: (a) => toExcelDate(a.createdAt || a.created_at),
  },
  {
    header: "Last Updated",
    width: 20,
    numFmt: DATETIME_FMT,
    value: (a) => toExcelDate(a.updatedAt || a.updated_at),
  },
];

const timestampedName = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `appointments-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.xlsx`;
};

/**
 * Export the given appointments (already filtered/sorted the way the admin sees
 * them) to an .xlsx file.
 */
export async function exportAppointmentsToExcel(appointments) {
  await exportRowsToExcel({
    rows: appointments,
    columns: APPOINTMENT_COLUMNS,
    fileName: timestampedName(),
    sheetName: "Appointments",
  });
}
