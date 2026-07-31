"use client";

import { Siren } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

// Emergency-SOS popup. Rendered from the dashboard layout so it shows on EVERY
// page/drawer, not just the dashboard. The SOS count is fetched by the sidebar
// on mount and shared via the store; we pop the alert once when it crosses the
// threshold. Because it lives in the layout, an admin who lands on (or reloads
// into) any page can dismiss the popup and silence the alarm.
export default function EmergencySosAlert() {
  const router = useRouter();

  const sosTotal = useSosStore((state) => state.total);
  const sosFetched = useSosStore((state) => state.hasFetched);
  const alertShown = useSosStore((state) => state.alertShown);
  const setAlertShown = useSosStore((state) => state.setAlertShown);
  const [sosDialogOpen, setSosDialogOpen] = useState(false);

  useEffect(() => {
    if (sosFetched && !alertShown && sosTotal >= SOS_ALERT_THRESHOLD) {
      setSosDialogOpen(true);
      setAlertShown(true);
    }
  }, [sosFetched, alertShown, sosTotal, setAlertShown]);

  // Closing the popup (Dismiss / View SOS / Esc) must silence the alarm.
  const handleSosDialogOpenChange = (open) => {
    setSosDialogOpen(open);
    if (!open) stopEmergencyAlert();
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
