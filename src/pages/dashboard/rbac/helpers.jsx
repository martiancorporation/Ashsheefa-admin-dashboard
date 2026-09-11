import { toast } from "sonner";

/**
 * Unwrap an API response from this backend.
 *
 * Business refusals ("this role is assigned to users", "email already in use")
 * come back as HTTP **202** with `{ error }`. The shared `handleResponse`
 * treats any 2xx as success and hands that object straight back, so a caller
 * checking `res?.deleted` sees `undefined` and fails silently with no toast.
 *
 * Run every RBAC mutation through this: it surfaces the server's reason and
 * reports failure, so a refused action always tells the user why.
 *
 * @param {object|false} res - whatever the API method returned
 * @returns {object|null} the payload on success, null if the action failed
 *
 * @example
 * const res = unwrap(await API.roles.DeleteRole(id));
 * if (res?.deleted) toast.success("Role deleted");
 */
export const unwrap = (res) => {
  // Falsy means a real HTTP error, which handleResponse has already toasted.
  if (!res) return null;

  if (res.error) {
    toast.error(res.error);
    return null;
  }

  return res;
};

/**
 * Shared bits for the RBAC tables (status badges + date formatting), used by
 * role-management, user-management, permission-requests and request-access.
 */

// Badge palette, matching the status pills used elsewhere in the dashboard
// (appointments, bookings): a solid pastel fill with a darker label of the same
// hue, fully rounded, no border.
const BADGE_BASE =
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  denied: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.withdrawn;
  return (
    <span className={`${BADGE_BASE} capitalize ${style}`}>{status}</span>
  );
}

const ACTION_STYLES = {
  granted: "bg-green-100 text-green-800",
  revoked: "bg-red-100 text-red-800",
};

export function AccessActionBadge({ action }) {
  const style = ACTION_STYLES[action] || "bg-gray-100 text-gray-800";
  return (
    <span className={`${BADGE_BASE} capitalize ${style}`}>{action}</span>
  );
}

const ROLE_ACTION_STYLES = {
  created: "bg-green-100 text-green-800",
  deleted: "bg-red-100 text-red-800",
};

/** Role History: whether a role was created or deleted. */
export function RoleActionBadge({ action }) {
  const style = ROLE_ACTION_STYLES[action] || "bg-gray-100 text-gray-800";
  return (
    <span className={`${BADGE_BASE} capitalize ${style}`}>{action}</span>
  );
}

export function UserStatusBadge({ status }) {
  return (
    <span
      className={`${BADGE_BASE} ${
        status === "ACTIVE"
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export function formatDateTime(raw) {
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Full name from a user-ish record, falling back to an empty string. */
export function fullName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
}

/** Table shell classes, matching the other Ashsheefa dashboard tables. */
export const TABLE_CLS = "w-full border border-gray-300 rounded-md";
export const THEAD_CLS =
  "bg-[#F9F9F9] rounded-md border border-gray-300";
export const TH_CLS =
  "text-[#7F7F7F] font-normal border-r border-gray-300";
export const TD_CLS = "border-r border-gray-300";

/** Simple inline loading block — the project has no Skeleton component. */
export function LoadingRowsCell({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
      <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      {label}
    </div>
  );
}
