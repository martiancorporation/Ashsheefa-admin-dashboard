import { exportRowsToExcel, toExcelDate } from "@/lib/exportToExcel";
import { fieldLabel, formatRoleKey, humanise, toDisplayLog } from "../helpers";

// Every field a log row holds, including the ones the table has no room for
// (IP, field-level changes) — an export is what gets handed to an auditor, so
// it should not be a narrower view than the screen. Worded the same way as the
// screen: no HTTP verbs, API paths or status codes.
const DATETIME_FMT = "dd-mmm-yyyy hh:mm:ss AM/PM";

/** "status: ACTIVE → INACTIVE; role: ADMIN → SUPERADMIN" */
const formatChanges = (changes) =>
  (changes || [])
    .map((change) => `${fieldLabel(change.field)}: ${change.from || "—"} → ${change.to || "—"}`)
    .join("; ");

const ACTOR_TYPES = {
  admin: "Dashboard user",
  app_user: "App user",
  public: "Website visitor",
  system: "System",
};

const ACTIVITY_LOG_COLUMNS = [
  { header: "No.", width: 6, value: (_row, index) => index + 1 },
  {
    header: "Date & Time",
    width: 24,
    numFmt: DATETIME_FMT,
    value: (row) => toExcelDate(row.created_at),
  },
  { header: "Module", width: 20, value: (row) => row.display_module || "" },
  { header: "Sub Module", width: 18, value: (row) => row.display_sub_module || "" },
  { header: "Action", width: 14, value: (row) => humanise(row.display_action) },
  { header: "Title", width: 28, value: (row) => row.display_title || "" },
  { header: "Description", width: 60, value: (row) => row.display_description || "" },
  { header: "Changes", width: 40, value: (row) => formatChanges(row.changes) },
  { header: "Record", width: 26, value: (row) => row.entity_label || "" },
  { header: "Record Type", width: 18, value: (row) => humanise(row.entity_type) },
  { header: "Record ID", width: 26, value: (row) => row.entity_id || "" },
  { header: "Performed By", width: 22, value: (row) => row.display_actor_name || "" },
  { header: "Email", width: 26, value: (row) => row.actor_email || "" },
  { header: "Role", width: 14, value: (row) => formatRoleKey(row.actor_role) },
  { header: "User Type", width: 14, value: (row) => ACTOR_TYPES[row.actor_type] || humanise(row.actor_type) },
  { header: "Status", width: 10, value: (row) => (row.status === "failed" ? "Failed" : "Success") },
  { header: "Result", width: 40, value: (row) => row.display_result || "" },
  { header: "Reason", width: 34, value: (row) => row.reason || "" },
  { header: "Network Address (IP)", width: 24, value: (row) => row.display_network || "" },
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
    rows: logs.map(toDisplayLog),
    columns: ACTIVITY_LOG_COLUMNS,
    fileName: fileNameFor(range),
    sheetName: "Activity Logs",
  });
}
