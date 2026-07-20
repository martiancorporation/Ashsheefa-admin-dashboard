"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Dispatched", label: "Dispatched" },
  { value: "En Route", label: "En Route" },
  { value: "Resolved", label: "Resolved" },
  { value: "Cancelled", label: "Cancelled" },
];

export function UpdateSosStatusModal({ open, onOpenChange, sos, onSave }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (open && sos) {
      setStatus(sos.status ?? "");
    }
  }, [open, sos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with the real API call once available,
      // e.g. `await API.emergencySos.updateStatus(sos._id, { status })`.
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSave) onSave(sos._id, status);
      toast.success("Emergency SOS status updated");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!sos) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#4B4B4B] text-base flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-500" />
            Update SOS Status
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {sos.patient_full_name} · {sos.emergency_type}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sos-status" className="text-sm text-gray-700">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="sos-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
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
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
