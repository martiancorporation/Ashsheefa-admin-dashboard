"use client";

import { Siren } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSosStore, { SOS_ALERT_THRESHOLD } from "@/store/sosStore";
import { stopEmergencyAlert } from "@/lib/emergencyAlertSound";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function EmergencySosAlert() {
  const router = useRouter();

  // NEW SOS FLOW (unread) commented out for now — using pending `total` instead.
  // const sosUnread = useSosStore((state) => state.unread);
  const sosTotal = useSosStore((state) => state.total);
  const sosFetched = useSosStore((state) => state.hasFetched);
  const dismissed = useSosStore((state) => state.dismissed);
  const setDismissed = useSosStore((state) => state.setDismissed);

  const sosDialogOpen =
    sosFetched && !dismissed && sosTotal >= SOS_ALERT_THRESHOLD;

  // Closing the popup (Dismiss / View SOS / Esc) latches dismissed and silences
  // the alarm so it doesn't keep ringing.
  const handleSosDialogOpenChange = (open) => {
    if (!open) {
      setDismissed(true);
      stopEmergencyAlert();
    }
  };

  // Leaving the dashboard area shouldn't leave the alarm ringing either.
  useEffect(() => stopEmergencyAlert, []);

  return (
    <AlertDialog open={sosDialogOpen} onOpenChange={handleSosDialogOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="relative mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF8282] opacity-75"></span>
            <Siren className="relative h-11 w-11 text-red-500" />
          </div>
          <AlertDialogTitle className="text-center text-red-600">
            {sosTotal} Emergency SOS {sosTotal === 1 ? "alert" : "alerts"} pending
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {sosTotal === 1
              ? "An emergency SOS has come in and needs your attention."
              : `${sosTotal} emergency SOS alerts have come in and need attention.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-x-3">
          <AlertDialogCancel className="border">Dismiss</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => router.push("/dashboard/emergency-sos")}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            View SOS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
