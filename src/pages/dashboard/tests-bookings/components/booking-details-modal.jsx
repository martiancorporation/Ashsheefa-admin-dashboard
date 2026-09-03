import {
  Calendar,
  CalendarClock,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatTime,
  getPaymentBadgeColor,
  getStatusBadgeColor,
} from "./constants";

const InfoRow = ({ label, value, icon: Icon, fullRow = false, children }) => (
  <div className={`flex flex-col gap-1 ${fullRow ? "col-span-full" : ""}`}>
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    {children ?? (
      <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
        {value || "Not specified"}
      </span>
    )}
  </div>
);

const longDate = (value) => {
  if (!value) return "Not available";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Not available";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function BookingDetailsModal({ open, onOpenChange, booking }) {
  if (!booking) return null;

  const patient = booking.patientId || null;
  const history = booking.reschedule_history || [];
  const tests = booking.tests || [];

  const collectionValue = booking.collection_date
    ? `${formatDate(booking.collection_date)}${
        booking.slot_start_time
          ? ` · ${formatTime(booking.slot_start_time)}${
              booking.slot_end_time ? ` – ${formatTime(booking.slot_end_time)}` : ""
            }`
          : ""
      }`
    : "Not specified";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#4B4B4B] text-base">
            Test Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pb-1">
          {/* ── 1. Patient Information ── */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Patient Information
              </h3>
              <Badge
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(
                  booking.test_status
                )}`}
              >
                {booking.test_status || "Not set"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Full Name" value={patient?.patient_full_name} />
              <InfoRow label="Gender" value={patient?.gender} />
              <InfoRow
                label="Contact Number"
                value={patient?.contact_number || booking.contact_number}
                icon={Phone}
              />
              <InfoRow label="Address" value={patient?.address} icon={MapPin} />
            </div>
          </div>

          {/* ── 2. Tests + Payment ── */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Calendar className="h-3.5 w-3.5" />
              Test Details
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Collection Date / Time">
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {collectionValue}
                </span>
              </InfoRow>

              <InfoRow
                label="Location"
                value={
                  booking.collection_type === "home"
                    ? "Home collection"
                    : "Hospital visit"
                }
                icon={MapPin}
              />
              <InfoRow
                label="Tests Booked"
                value={booking.tests_count ?? tests.length}
              />
              <InfoRow label="Test Status">
                <Badge
                  className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(
                    booking.test_status
                  )}`}
                >
                  {booking.test_status || "Not Specified"}
                </Badge>
              </InfoRow>

              {/* Divider */}
              <div className="col-span-full border-t border-blue-200 my-1" />

              <InfoRow label="Tests Total">
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {Number(booking.tests_total || 0).toLocaleString("en-IN")}
                </span>
              </InfoRow>
              <InfoRow label="Registration Fee">
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {Number(booking.registration_fee || 0).toLocaleString("en-IN")}
                </span>
              </InfoRow>
              <InfoRow label="Total">
                <span className="text-sm text-gray-900 font-semibold flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {Number(booking.amount || 0).toLocaleString("en-IN")}
                </span>
              </InfoRow>
              <InfoRow label="Payment Status">
                <Badge
                  className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${getPaymentBadgeColor(
                    booking.paymentStatus
                  )}`}
                >
                  {booking.paymentStatus || "Not Specified"}
                </Badge>
              </InfoRow>
            </div>
          </div>

          {/* ── 3. Additional Information ── */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Created" value={longDate(booking.createdAt)} />
              <InfoRow label="Last Updated" value={longDate(booking.updatedAt)} />

              {booking.notes && (
                <InfoRow label="Notes" fullRow>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                    {booking.notes}
                  </p>
                </InfoRow>
              )}
            </div>
          </div>

          {/* ── 4. Reschedule trail — why the current date is what it is ── */}
          {history.length > 0 && (
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <CalendarClock className="h-3.5 w-3.5" />
                Reschedule History ({history.length})
              </h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="text-sm bg-white border border-purple-100 rounded-lg px-3 py-2"
                  >
                    <div className="text-gray-800">
                      {formatDate(h.from_date)}
                      {h.from_slot_start_time &&
                        ` · ${formatTime(h.from_slot_start_time)}`}
                      {"  →  "}
                      <span className="font-medium">
                        {formatDate(h.to_date)}
                        {h.to_slot_start_time && ` · ${formatTime(h.to_slot_start_time)}`}
                      </span>
                    </div>
                    {h.reason && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Reason: {h.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. The tests themselves, with what each one costs ── */}
          {tests.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                Booked tests ({tests.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {tests.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm text-gray-700 bg-white border border-gray-100 rounded px-2.5 py-1.5"
                  >
                    <span className="break-words">{t.test_name}</span>
                    <span className="shrink-0 text-gray-800 font-medium">
                      ₹{Number(t.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
