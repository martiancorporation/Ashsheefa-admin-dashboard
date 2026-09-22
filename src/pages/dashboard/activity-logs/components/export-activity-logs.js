import { exportRowsToExcel, toExcelDate } from "@/lib/exportToExcel";

// Every field a log row holds, including the ones the table has no room for
// (IP, endpoint, field-level changes) — an export is what gets handed to an
// auditor, so it should not be a narrower view than the screen.
const DATETIME_FMT = "dd-mmm-yyyy hh:mm:ss AM/PM";

/** "status: ACTIVE → INACTIVE; role: ADMIN → SUPERADMIN" */
const formatChanges = (changes) =>
  (changes || [])
    .map((change) => `${change.field}: ${change.from || "—"} → ${change.to || "—"}`)
    .join("; ");

const ACTIVITY_LOG_COLUMNS = [
  { header: "No.", width: 6, value: (_row, index) => index + 1 },
  {
    header: "Date & Time",
    width: 24,
    numFmt: DATETIME_FMT,
    value: (row) => toExcelDate(row.created_at),
  },
  { header: "Module", width: 20, value: (row) => row.module || "" },
  { header: "Sub Module", width: 18, value: (row) => row.sub_module || "" },
  { header: "Action", width: 14, value: (row) => row.action || "" },
  { header: "Title", width: 28, value: (row) => row.title || "" },
  { header: "Description", width: 60, value: (row) => row.description || "" },
  { header: "Changes", width: 40, value: (row) => formatChanges(row.changes) },
  { header: "Record", width: 26, value: (row) => row.entity_label || "" },
  { header: "Record Type", width: 18, value: (row) => row.entity_type || "" },
  { header: "Record ID", width: 26, value: (row) => row.entity_id || "" },
  { header: "Performed By", width: 22, value: (row) => row.actor_name || "" },
  { header: "Email", width: 26, value: (row) => row.actor_email || "" },
  { header: "Role", width: 14, value: (row) => row.actor_role || "" },
  { header: "Actor Type", width: 12, value: (row) => row.actor_type || "" },
  { header: "Status", width: 10, value: (row) => row.status || "" },
  { header: "Reason", width: 34, value: (row) => row.reason || "" },
  { header: "Method", width: 8, value: (row) => row.method || "" },
  { header: "Endpoint", width: 44, value: (row) => row.path || "" },
  { header: "IP Address", width: 18, value: (row) => row.ip || "" },
];

/** activity-logs-2026-09-21.xlsx, or …-2026-09-01-to-2026-09-21.xlsx for a range. */
const fileNameFor = (range) => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (range?.from && range?.to) {
    return `activity-logs-${range.from}-to-${range.to}.xlsx`;
  }
  return `activity-logs-${today}.xlsx`;
};

/**
 * Write the given log rows to an .xlsx file.
 *
 * @param {Array} logs - rows exactly as the API returned them
 * @param {{from?: string, to?: string}} [range] - names the file after the filter
 */
export async function exportActivityLogsToExcel(logs, range) {
  await exportRowsToExcel({
    rows: logs,
    columns: ACTIVITY_LOG_COLUMNS,
    fileName: fileNameFor(range),
    sheetName: "Activity Logs",
  });
}
