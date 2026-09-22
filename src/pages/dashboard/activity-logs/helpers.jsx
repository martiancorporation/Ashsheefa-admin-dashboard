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
  payment: "bg-purple-100 text-purple-800",
  read: "bg-gray-100 text-gray-800",
  other: "bg-gray-100 text-gray-800",
};

/** "status_change" → "Status change" */
export const humanise = (value) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

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
  public: "Public",
  system: "System",
};

export function ActorTypeBadge({ actorType }) {
  return (
    <span className="text-[11px] text-gray-400">
      {ACTOR_TYPE_LABELS[actorType] || actorType}
    </span>
  );
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
