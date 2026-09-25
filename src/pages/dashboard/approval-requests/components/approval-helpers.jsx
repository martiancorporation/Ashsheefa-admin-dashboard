import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import API from "@/api";
import useAuthDataStore from "@/store/authStore";
import { isSuperadmin } from "@/lib/rbac";

/**
 * Shared bits of the approval flow: payment-status changes by anyone but the
 * superadmin go through an approval request (backend: /v1/approval-requests).
 * Used by the Appointments / Checkup / Tests tables and the superadmin's
 * Approval Requests drawer.
 */

/** Fired after an approve/reject so the sidebar badge refreshes at once. */
export const APPROVALS_CHANGED_EVENT = "approval-requests:changed";

export const ENTITY_TYPES = {
  appointment: { label: "Appointment", drawer: "/dashboard/appointments" },
  checkup_booking: { label: "Checkup Booking", drawer: "/dashboard/checkup-bookings" },
  test_booking: { label: "Test Booking", drawer: "/dashboard/tests-bookings" },
};

export const REQUEST_TYPE_LABEL = {
  mark_paid: "Mark as paid",
  payment_status: "Payment status change",
};

export const FIELD_LABEL = {
  paymentStatus: "Payment status",
  paymentMode: "Payment mode",
  transaction_id: "Transaction ID",
  status: "Status",
  checkup_status: "Checkup status",
  test_status: "Test status",
};

const MODE_LABEL = { cash: "Cash", upi: "UPI", card: "Card", icici: "ICICI (online)", cashfree: "Cashfree" };

/** Human form of a field's value: "upi" → "UPI", "pending" → "Pending". */
export function formatValue(field, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "paymentMode") return MODE_LABEL[value] || value;
  if (field === "paymentStatus") return value.charAt(0).toUpperCase() + value.slice(1);
  return value;
}

const BADGE_BASE =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-700",
};

export function ApprovalStatusBadge({ status }) {
  return (
    <span className={`${BADGE_BASE} ${STATUS_STYLES[status] || STATUS_STYLES.withdrawn}`}>
      {status === "pending" && <Clock className="w-3 h-3" />}
      {status === "pending" ? "Awaiting approval" : status}
    </span>
  );
}

/** One "Payment status  pending → paid" line. */
/**
 * Marking paid records a NEW payment: its mode and transaction ID are that
 * payment's own, so whatever an earlier (failed or undone) attempt left on the
 * record is not shown as a "from".
 */
const PAYMENT_DETAIL_FIELDS = ["paymentMode", "transaction_id"];
export const showsNewValueOnly = (request, field) =>
  request?.request_type === "mark_paid" && PAYMENT_DETAIL_FIELDS.includes(field);

export function ChangeLine({ change, newOnly = false }) {
  const label = change.field_label || FIELD_LABEL[change.field] || change.field;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 min-w-[120px]">{label}</span>
      {/* Same value both sides, or a new payment's own detail: state it once. */}
      {!newOnly && change.from !== change.to && (
        <>
          <span className="text-gray-700">{formatValue(change.field, change.from)}</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </>
      )}
      <span className="font-medium text-gray-900">{formatValue(change.field, change.to)}</span>
    </div>
  );
}

/** Whether the signed-in admin must ask for approval (everyone but superadmin). */
export function useNeedsApproval() {
  const authData = useAuthDataStore((state) => state.authData);
  return !isSuperadmin(authData);
}

/** The signed-in admin's user id, for "is this my request?". */
export function useCurrentUserId() {
  const authData = useAuthDataStore((state) => state.authData);
  return String(authData?._id || authData?.id || "");
}

/**
 * Pending approval requests for the records on screen, keyed by record id.
 *
 * @param {string} entityType - "appointment" | "checkup_booking" | "test_booking"
 * @param {string[]} ids - record ids currently listed
 * @returns {{ pending: Record<string, object>, refresh: () => Promise<void> }}
 */
export function usePendingApprovals(entityType, ids) {
  const [pending, setPending] = useState({});
  const key = (ids || []).filter(Boolean).join(",");

  const refresh = useCallback(async () => {
    if (!key) {
      setPending({});
      return;
    }
    const res = await API.approvalRequests.GetPendingForRecords(entityType, key.split(","));
    if (res && !res.error) setPending(res.pending || {});
  }, [entityType, key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { pending, refresh };
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

/**
 * Stands in for a record's payment-status dropdown while a request is open, so
 * nobody tries to change it twice. Clicking opens the request's status.
 */
export function PendingApprovalPill({ request, onClick }) {
  const change = request?.changes?.find((c) => c.field === "paymentStatus");
  const detail = change ? ` (${change.from} → ${change.to})` : "";
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Payment status change${detail} is waiting for superadmin approval — click to check its status`}
      className="mx-auto inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 hover:brightness-95 cursor-pointer"
    >
      <Clock className="w-3 h-3" />
      Awaiting approval
    </button>
  );
}
