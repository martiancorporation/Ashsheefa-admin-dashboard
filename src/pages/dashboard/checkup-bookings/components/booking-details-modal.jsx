import { CalendarClock, FlaskConical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatTime,
  getPaymentBadgeColor,
  getStatusBadgeColor,
  MODE_LABEL,
} from "./constants";

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500 shrink-0">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right break-words">
      {value ?? "—"}
    </span>
  </div>
);

export function BookingDetailsModal({ open, onOpenChange, booking }) {
  if (!booking) return null;

  const patient = booking.patientId || null;
  const checkup = booking.checkupId || null;
  const history = booking.reschedule_history || [];
  const tests = checkup?.tests || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-[#4B4B4B]">
            <FlaskConical className="w-4 h-4 text-blue-600" />
            Checkup Booking Details
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Booked on{" "}
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 mt-2">Patient</h4>
            <Row label="Name" value={patient?.patient_full_name} />
            <Row label="Gender" value={patient?.gender} />
            <Row label="Contact" value={patient?.contact_number || booking.contact_number} />
            <Row label="Email" value={patient?.email} />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 mt-2">Checkup</h4>
            <Row label="Package" value={booking.checkup_name || checkup?.checkup_name} />
            <Row label="Tests Included" value={booking.tests_count ?? tests.length} />
            <Row
              label="Collection"
              value={`${formatDate(booking.collection_date)}${
                booking.slot_start_time ? ` · ${formatTime(booking.slot_start_time)}` : ""
              }`}
            />
            <Row
              label="Location"
              value={booking.collection_type === "home" ? "Home collection" : "Hospital visit"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 mt-2">Status</h4>
            <Row
              label="Checkup Status"
              value={
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(
                    booking.checkup_status
                  )}`}
                >
                  {booking.checkup_status}
                </span>
              }
            />
            <Row
              label="Payment Status"
              value={
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getPaymentBadgeColor(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus}
                </span>
              }
            />
            {booking.notes && <Row label="Notes" value={booking.notes} />}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1 mt-2">Payment</h4>
            <Row label="Package Price" value={`₹ ${Number(booking.package_price || 0)}`} />
            <Row
              label="Registration Fee"
              value={`₹ ${Number(booking.registration_fee || 0)}`}
            />
            <Row label="Total" value={`₹ ${Number(booking.amount || 0)}`} />
            <Row label="Mode" value={MODE_LABEL[booking.paymentMode] || booking.paymentMode} />
            <Row label="Reference" value={booking.transaction_id || booking.orderId} />
          </div>
        </div>

        {/* Reschedule trail — why the current date is what it is */}
        {history.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-purple-600" />
              Reschedule History ({history.length})
            </h4>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="text-sm bg-purple-50 border border-purple-100 rounded-lg px-3 py-2"
                >
                  <div className="text-gray-800">
                    {formatDate(h.from_date)}
                    {h.from_slot_start_time && ` · ${formatTime(h.from_slot_start_time)}`}
                    {"  →  "}
                    <span className="font-medium">
                      {formatDate(h.to_date)}
                      {h.to_slot_start_time && ` · ${formatTime(h.to_slot_start_time)}`}
                    </span>
                  </div>
                  {h.reason && (
                    <div className="text-xs text-gray-500 mt-0.5">Reason: {h.reason}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tests.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Tests in this package
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {tests.map((t, i) => (
                <div
                  key={i}
                  className="text-sm text-gray-600 bg-gray-50 rounded px-2.5 py-1.5"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
