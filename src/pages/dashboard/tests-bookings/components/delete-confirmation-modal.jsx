import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function DeleteConfirmationModal({ open, onOpenChange, booking, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await API.testBookings.deleteBooking(booking._id);
      if (res?.success || res?.data) {
        toast.success("Booking deleted");
        onDeleted?.();
        onOpenChange(false);
      } else {
        toast.error(res?.error || res?.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("An error occurred while deleting the booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-red-700">
            <Trash2 className="w-4 h-4" />
            Delete Booking
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            This removes the booking from the list. Payment records are kept.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Patient: </span>
            {booking?.patientId?.patient_full_name || "—"}
          </p>
          <p>
            <span className="font-medium">Tests: </span>
            {booking?.tests_count ?? booking?.tests?.length ?? "—"}
          </p>
          {booking?.paymentStatus === "paid" && (
            <p className="text-xs text-red-700 pt-1">
              ⚠️ This booking has been paid for. Make sure any refund is handled
              separately.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
