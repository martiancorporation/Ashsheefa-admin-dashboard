import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import API from "@/api";
import { toLocalDateStr } from "./constants";

/**
 * Corrections to a booking. Postponing is deliberately NOT done here — it goes
 * through the reschedule modal so the change is recorded in the history.
 */
export function EditBookingModal({ open, onOpenChange, booking, onSave }) {
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open || !booking) return;
    setContact(booking.contact_number || booking.patientId?.contact_number || "");
    setDate(booking.collection_date ? toLocalDateStr(booking.collection_date) : "");
    setStartTime(booking.slot_start_time || "");
    setNotes(booking.notes || "");
  }, [open, booking]);

  const deriveEnd = (start) => {
    if (!start) return undefined;
    const [h, m] = start.split(":").map(Number);
    if (isNaN(h)) return undefined;
    const total = h * 60 + (m || 0) + 30;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
      total % 60
    ).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contact && !/^\d{10}$/.test(contact.replace(/\D/g, "").slice(-10))) {
      toast.error("Enter a valid 10-digit contact number");
      return;
    }

    setLoading(true);
    try {
      const res = await API.healthCheckupBookings.updateBooking(booking._id, {
        contact_number: contact.replace(/\D/g, "").slice(-10),
        collection_date: date || undefined,
        slot_start_time: startTime || undefined,
        slot_end_time: deriveEnd(startTime),
        notes: notes.trim(),
      });

      if (res?.success || res?.data) {
        toast.success("Booking updated");
        onSave?.();
        onOpenChange(false);
      } else {
        toast.error(res?.error || res?.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("An error occurred while updating the booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-[#4B4B4B]">
            <Pencil className="w-4 h-4 text-blue-600" />
            Edit Booking
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            To postpone a checkup, use Reschedule instead — it keeps a record of
            the change.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-800">Patient: </span>
              {booking?.patientId?.patient_full_name || "—"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Package: </span>
              {booking?.checkup_name || "—"}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[#4A4A4B] text-sm">Contact Number</Label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none"
              placeholder="10-digit number"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-[#4A4A4B] text-sm">Collection Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-[#4A4A4B] text-sm">Collection Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[#4A4A4B] text-sm">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes for reception / lab"
              className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
