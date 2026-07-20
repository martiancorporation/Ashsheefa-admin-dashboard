"use client";

import React from "react";
import {
  User,
  Phone,
  MapPin,
  Siren,
  Clock,
  Ambulance,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-red-100 text-red-800 border-red-200";
      case "dispatched":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en route":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  const mapUrl =
    sos.latitude && sos.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${sos.latitude},${sos.longitude}`
      : sos.location_address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sos.location_address)}`
        : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#4B4B4B] text-base flex items-center gap-2">
            <Siren className="h-4 w-4 text-red-500" />
            Emergency SOS Details
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
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(sos.status)}`}
              >
                {sos.status || "Not set"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Full Name" value={sos.patient_full_name} />
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
            </div>
          </div>

          {/* ── 2. Emergency Details ── */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Siren className="h-3.5 w-3.5" />
              Emergency Details
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Emergency Type" value={sos.emergency_type} icon={Siren} />
              <InfoRow label="Priority">
                <Badge
                  className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium ${getPriorityBadgeColor(sos.priority)}`}
                >
                  {sos.priority || "N/A"}
                </Badge>
              </InfoRow>

              <InfoRow label="Requested At" icon={Clock}>
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {formatDateTime(sos.createdAt)}
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <Badge
                  className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(sos.status)}`}
                >
                  {sos.status || "N/A"}
                </Badge>
              </InfoRow>

              <div className="col-span-full border-t border-red-200 my-1" />

              {/* Location — full row */}
              <InfoRow label="Location" fullRow>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-gray-800 font-medium flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    {sos.location_address || "Not specified"}
                  </span>
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      View on map
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {sos.latitude && sos.longitude && (
                  <span className="text-xs text-gray-400 mt-1">
                    {sos.latitude}, {sos.longitude}
                  </span>
                )}
              </InfoRow>
            </div>
          </div>

          {/* ── 3. Response / Dispatch ── */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Ambulance className="h-3.5 w-3.5" />
              Response & Dispatch
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow
                label="Assigned Ambulance"
                value={sos.assigned_ambulance}
                icon={Ambulance}
              />
              <InfoRow
                label="Assigned Responder"
                value={sos.assigned_responder}
                icon={Stethoscope}
              />
            </div>
          </div>

          {/* ── 4. Additional Notes ── */}
          {sos.notes && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Notes
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sos.notes}
              </p>
            </div>
          )}

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
