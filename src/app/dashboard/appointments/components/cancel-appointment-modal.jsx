"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import appointments from "@/api/appointments";

export function CancelAppointmentModal({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!appointment) return;

    setLoading(true);
    try {
      const response = await appointments.updateAppointment(appointment._id, {
        status: "Cancelled",
      });
      if (response.error) {
        toast.error(response.error);
        return;
      }
      if (response?.success || response?.data) {
        toast.success("Appointment cancelled successfully");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("An error occurred while cancelling the appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">
            Do you want to cancel this appointment?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            No
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
