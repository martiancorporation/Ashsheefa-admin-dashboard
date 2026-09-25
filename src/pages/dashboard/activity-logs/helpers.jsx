/**
 * Presentation bits for the activity trail. Table shell classes are shared
 * with the RBAC tables so every table in the dashboard looks the same.
 */

const BADGE_BASE =
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap";

// Grouped by what the action does to the data, so the table reads at a glance:
// green adds, amber changes, red removes/refuses, blue is read-only movement.
const ACTION_STYLES = {
  create: "bg-green-100 text-green-800",
  upload: "bg-green-100 text-green-800",
  grant: "bg-green-100 text-green-800",
  approve: "bg-green-100 text-green-800",
  restore: "bg-green-100 text-green-800",
  resolve: "bg-green-100 text-green-800",

  update: "bg-amber-100 text-amber-800",
  status_change: "bg-amber-100 text-amber-800",
  reschedule: "bg-amber-100 text-amber-800",

  delete: "bg-red-100 text-red-800",
  revoke: "bg-red-100 text-red-800",
  deny: "bg-red-100 text-red-800",
  access_denied: "bg-red-100 text-red-800",

  login: "bg-blue-100 text-blue-800",
  logout: "bg-blue-100 text-blue-800",
  export: "bg-blue-100 text-blue-800",
  email: "bg-blue-100 text-blue-800",
  visit: "bg-blue-100 text-blue-800",
  payment: "bg-purple-100 text-purple-800",
  read: "bg-gray-100 text-gray-800",
  other: "bg-gray-100 text-gray-800",
};

/** "status_change" → "Status change" */
export const humanise = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

/** A stored field name as people read it: "paymentStatus" → "Payment status". */
const FIELD_LABELS = {
  paymentStatus: "Payment status",
  paymentMode: "Payment mode",
  transaction_id: "Transaction ID",
  checkup_status: "Checkup status",
  test_status: "Test status",
  doctorId: "Doctor",
  patientId: "Patient",
};

export const fieldLabel = (field) =>
  FIELD_LABELS[field] ||
  humanise(String(field || "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase());

/** Status "pending" → "Pending", mode "upi" → "UPI"; free text as typed. */
export const formatChangeValue = (field, value) => {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value);
  if (field === "paymentMode") {
    return { upi: "UPI", icici: "ICICI (online)", cash: "Cash", card: "Card" }[text] || text;
  }
  const isStatus = ["paymentStatus", "status", "checkup_status", "test_status"].includes(field);
  return isStatus && /^[a-z]+$/.test(text) ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};

export function ActionBadge({ action }) {
  const style = ACTION_STYLES[action] || ACTION_STYLES.other;
  return <span className={`${BADGE_BASE} ${style}`}>{humanise(action)}</span>;
}

export function LogStatusBadge({ status }) {
  return (
    <span
      className={`${BADGE_BASE} ${
        status === "failed"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800"
      }`}
    >
      {status === "failed" ? "Failed" : "Success"}
    </span>
  );
}

/** Who acted — an admin account, the patient app, the public site, or a machine. */
const ACTOR_TYPE_LABELS = {
  admin: "Admin",
  app_user: "App user",
  public: "Website",
  system: "System",
};

/**
 * A role key as people read it: "SUPERADMIN" → "Super Admin", "hr" → "Hr",
 * "front_desk" → "Front Desk".
 */
export function formatRoleKey(roleKey) {
  if (!roleKey) return "";
  if (roleKey === "SUPERADMIN") return "Super Admin";
  return String(roleKey)
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * The line under the actor's name: their role for a dashboard admin (every
 * dashboard login is actor_type "admin", superadmin included, so the type alone
 * says nothing), otherwise what kind of actor it was.
 */
export function ActorTypeBadge({ actorType, actorRole }) {
  const label =
    actorType === "admin" && actorRole
      ? formatRoleKey(actorRole)
      : ACTOR_TYPE_LABELS[actorType] || actorType;
  return <span className="text-[11px] text-gray-400">{label}</span>;
}

/** "21 Sep 2026" and "03:24:18 pm" as separate lines — the table shows both. */
export function formatLogDate(raw) {
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatLogTime(raw) {
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** `YYYY-MM-DD` in local time — the format the API's date filters expect. */
export function toApiDate(date) {
  if (!date) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// ── Plain-language view of a row 

const VISITOR_PATH = /\/public\/visitor\/track-visitor/;

const METHOD_PHRASES = {
  POST: "Added a new entry",
  PUT: "Updated an entry",
  PATCH: "Updated an entry",
  DELETE: "Removed an entry",
};

const GENERIC_TITLES = {
  create: "New entry added",
  update: "Entry updated",
  delete: "Entry removed",
};

/** Keys some clients post in the body by mistake, e.g. "Content-Type". */
const HEADER_LIKE = /^(content-type|accept|user-agent|x-[\w-]+)$/i;

const listWords = (words) =>
  words.length > 1
    ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`
    : words[0] || "";

/** "POST /v1/x — Asha (fields: page_url, Content-Type)" → plain English. */
const rewriteRawDescription = (log, module) => {
  const text = String(log.description || "");
  const raw = text.match(/^(POST|PUT|PATCH|DELETE|GET) \/\S*(.*)$/);
  if (!raw) return text;

  let rest = raw[2];
  let details = "";
  const fieldsMatch = rest.match(/ \(fields: ([^)]*)\)/);
  if (fieldsMatch) {
    const fields = fieldsMatch[1]
      .split(/, | and /)
      .map((f) => f.trim())
      .filter((f) => f && !HEADER_LIKE.test(f))
      .map((f) => fieldLabel(f).toLowerCase());
    if (fields.length) details = ` (details given: ${listWords(fields)})`;
    rest = rest.replace(fieldsMatch[0], "");
  }
  return `${METHOD_PHRASES[raw[1]] || "Made a change"} in ${module}${rest}${details}`;
};

/** The dashboard page a row's record lives on, so the admin can go and look. */
const PAGE_BY_ENTITY = {
  appointment: { to: "/dashboard/appointments", label: "Appointments" },
  approval_request: { to: "/dashboard/approval-requests", label: "Approval Requests" },
  blog: { to: "/dashboard/blogs", label: "Blogs" },
  checkup_booking: { to: "/dashboard/checkup-bookings", label: "Checkup Bookings" },
  test_booking: { to: "/dashboard/tests-bookings", label: "Tests Bookings" },
  department: { to: "/dashboard/departments", label: "Departments", detail: true },
  doctor: { to: "/dashboard/doctors", label: "Doctors", detail: true },
  health_checkup: { to: "/dashboard/health-checkup", label: "Health Checkup", detail: true },
  international_patient: { to: "/dashboard/international-patients", label: "International Patients" },
  news: { to: "/dashboard/news", label: "News" },
  patient: { to: "/dashboard/patient", label: "Patients", detail: true },
  patients_enquiry: { to: "/dashboard/patients-enquiries", label: "Patient Enquiries" },
  sos: { to: "/dashboard/emergency-sos", label: "Emergency SOS" },
  role: { to: "/dashboard/role-management", label: "Role Management" },
  permission: { to: "/dashboard/permission-requests", label: "Permission Requests" },
  permission_request: { to: "/dashboard/permission-requests", label: "Permission Requests" },
  user: { to: "/dashboard/user-management", label: "User Management" },
};

const PAGE_BY_MODULE = {
  Appointments: PAGE_BY_ENTITY.appointment,
  "Approval Requests": PAGE_BY_ENTITY.approval_request,
  Blog: PAGE_BY_ENTITY.blog,
  "Checkup Bookings": PAGE_BY_ENTITY.checkup_booking,
  "Tests Bookings": PAGE_BY_ENTITY.test_booking,
  Departments: PAGE_BY_ENTITY.department,
  Doctors: PAGE_BY_ENTITY.doctor,
  "Health Checkup": PAGE_BY_ENTITY.health_checkup,
  "International Patient": PAGE_BY_ENTITY.international_patient,
  News: PAGE_BY_ENTITY.news,
  Patients: PAGE_BY_ENTITY.patient,
  "Patients Enquiry": PAGE_BY_ENTITY.patients_enquiry,
  "Emergency SOS": PAGE_BY_ENTITY.sos,
  Roles: PAGE_BY_ENTITY.role,
  Permissions: PAGE_BY_ENTITY.permission,
  Users: PAGE_BY_ENTITY.user,
  "Activity Logs": { to: "/dashboard/activity-logs", label: "Activity Logs" },
};

const pageFor = (log, module) => {
  const page = PAGE_BY_ENTITY[log.entity_type] || PAGE_BY_MODULE[module];
  if (!page) return null;
  // Deleted records have no page of their own any more.
  const toRecord = page.detail && log.entity_id && log.action !== "delete";
  return {
    to: toRecord ? `${page.to}/${log.entity_id}` : page.to,
    label: toRecord ? `Open this record in ${page.label}` : `Go to ${page.label}`,
  };
};

/** What the HTTP status code means, said the way a person would say it. */
const resultOf = (log) => {
  const code = Number(log.status_code);
  if (log.status !== "failed" && (!code || code < 400)) return "Completed successfully";
  if (code === 401) return "Not completed — the person was not signed in";
  if (code === 403) return "Not allowed — the person doesn't have permission for this";
  if (code === 404) return "Not completed — the record could not be found";
  if (code === 409) return "Not completed — this clashes with an existing record";
  if (code === 400 || code === 422 || code === 202)
    return "Not completed — some of the details given were missing or invalid";
  if (code === 429) return "Not completed — too many attempts, try again later";
  if (code >= 500) return "Not completed — a problem on our side";
  return "Not completed";
};

/** "::1" / "127.0.0.1" only ever come from someone testing on the server itself. */
const networkOf = (ip) => {
  if (!ip) return "";
  if (["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(ip)) return "Same computer as the server (testing)";
  return ip.replace(/^::ffff:/, "");
};

/**
 * A copy of the row with every field worded for people. Raw fields are left
 * alone; the readable ones are added alongside with a `display_` prefix.
 */
export function toDisplayLog(log) {
  if (!log) return log;
  const isVisit = VISITOR_PATH.test(log.path || "");
  const module = isVisit && log.module === "Other" ? "Website" : log.module;

  const actorName =
    log.actor_name === "Public / unauthenticated" ? "Website visitor" : log.actor_name;

  const legacyTitle = log.title === `${log.module} ${log.action}`;
  const title = isVisit && legacyTitle
    ? "Website visit"
    : legacyTitle
      ? GENERIC_TITLES[log.action] || "Change made"
      : log.title;

  const description =
    isVisit && /^POST /.test(log.description || "")
      ? "Someone opened the website"
      : rewriteRawDescription(log, module);

  return {
    ...log,
    display_module: module,
    display_sub_module: isVisit && !log.sub_module ? "Visit" : log.sub_module,
    display_action: isVisit && log.action === "create" ? "visit" : log.action,
    display_title: title,
    display_description: description,
    display_actor_name: actorName,
    display_result: resultOf(log),
    display_network: networkOf(log.ip),
    display_page: pageFor(log, module),
  };
}
