import React from "react";
import {
  User,
  Phone,
  MapPin,
  Siren,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function EmergencySosDetailsModal({ sos, onClose }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (!sos) return null;

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

  const mapUrl = sos.location_address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sos.location_address)}`
    : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#4B4B4B] text-base flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-500 animate-pulse" />
            Emergency SOS Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pb-1">
          {/* ── 1. Patient Information ── */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User className="h-3.5 w-3.5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Full Name" value={sos.patient_full_name} />
              <InfoRow label="UHID" value={sos.uhid} />
              <InfoRow label="Gender" value={sos.gender} />
              <InfoRow
                label="Age"
                value={sos.age ? `${sos.age} years` : "Not specified"}
              />
              <InfoRow
                label="Contact Number"
                value={sos.contact_number}
                icon={Phone}
              />
              <InfoRow label="Patient Status" value={sos.patient_status} />
            </div>
          </div>

          {/* ── 2. SOS Alert ── */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Siren className="h-3.5 w-3.5" />
              SOS Alert
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Requested At" icon={Clock}>
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {formatDateTime(sos.createdAt)}
                </span>
              </InfoRow>
              <InfoRow
                label="Triggered By (Phone)"
                value={sos.triggered_by_phone}
                icon={Phone}
              />

              <div className="col-span-full border-t border-red-200 my-1" />

              <InfoRow label="Location" fullRow>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-gray-800 font-medium flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    {sos.location_address || "Not specified"}
                  </span>
                  {/* {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      View on map
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )} */}
                </div>
              </InfoRow>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
