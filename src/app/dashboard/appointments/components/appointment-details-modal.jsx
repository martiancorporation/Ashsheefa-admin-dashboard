"use client"

import React from "react"
import { User, Phone, Calendar, MapPin, Stethoscope, FileText, CreditCard, Clock, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function AppointmentDetailsModal({ appointment, onClose, onSave }) {

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (time) => {
        if (!time) return null
        const [h, m] = time.split(":").map(Number)
        const suffix = h >= 12 ? "PM" : "AM"
        const hr = h % 12 || 12
        return `${hr}:${String(m).padStart(2, "0")} ${suffix}`
    }

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "in progress": return "bg-orange-100 text-orange-800 border-orange-200"
            case "cancelled": return "bg-red-100 text-red-800 border-red-200"
            case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200"
            case "paid": return "bg-green-100 text-green-800 border-green-200"
            case "failed": return "bg-red-100 text-red-800 border-red-200"
            case "unpaid": return "bg-gray-100 text-gray-600 border-gray-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getPaymentModeBadgeColor = (mode) => {
        switch (mode?.toLowerCase()) {
            case "online": return "bg-purple-100 text-purple-800 border-purple-200"
            case "cash": return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "card": return "bg-sky-100 text-sky-800 border-sky-200"
            default: return "bg-gray-100 text-gray-600 border-gray-200"
        }
    }

    if (!appointment) return null

    // Reusable label + value field
    const InfoRow = ({ label, value, icon: Icon, fullRow = false, children }) => (
        <div className={`flex flex-col gap-1 ${fullRow ? "col-span-full" : ""}`}>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
            {children ?? (
                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                    {Icon && <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
                    {value || "Not specified"}
                </span>
            )}
        </div>
    )

    // Build the date/time string
    const startTime = formatTime(appointment.slot_start_time)
    const endTime = formatTime(appointment.slot_end_time)
    const dateTimeValue = appointment.appointment_date
        ? `${formatDate(appointment.appointment_date)}${startTime ? ` · ${startTime}${endTime ? ` – ${endTime}` : ""}` : ""}`
        : "Not specified"

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#4B4B4B] text-base">
                        Appointment Details
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
                            <Badge className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(appointment.status)}`}>
                                {appointment.status || "Not set"}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <InfoRow label="Full Name" value={appointment.patientId?.patient_full_name} />
                            <InfoRow label="Date of Birth" value={appointment.patientId?.date_of_birth ? formatDate(appointment.patientId.date_of_birth) : "Not specified"} />
                            <InfoRow label="Gender" value={appointment.patientId?.gender} />
                            <InfoRow label="Contact Number" value={appointment.patientId?.contact_number} icon={Phone} />
                        </div>
                    </div>

                    {/* ── 2. Appointment + Payment ── */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Calendar className="h-3.5 w-3.5" />
                            Appointment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                            {/* Appointment Date / Time — full row */}
                            <InfoRow label="Appointment Date / Time" icon={Clock}>
                                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    {dateTimeValue}
                                </span>
                            </InfoRow>

                            <InfoRow label="Department" value={appointment.doctorId?.department} icon={MapPin} />
                            <InfoRow label="Doctor" value={appointment.doctorId?.fullName} icon={Stethoscope} />
                            <InfoRow label="Status" value={appointment.status} icon={Stethoscope} />

                            {/* Divider */}
                            <div className="col-span-full border-t border-blue-200 my-1" />

                            {/* Amount */}
                            <InfoRow label="Amount">
                                <span className="text-sm text-gray-800 font-medium flex items-center gap-1">
                                    <IndianRupee className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    {appointment.amount ?? appointment.doctorId?.fees ?? "N/A"}
                                </span>
                            </InfoRow>

                            {/* Payment Status */}
                            <InfoRow label="Payment Status">
                                <Badge className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(appointment.paymentStatus)}`}>
                                    {appointment.paymentStatus || "N/A"}
                                </Badge>
                            </InfoRow>

                            {/* Payment Mode */}
                            <InfoRow label="Payment Mode">
                                {appointment.paymentMode ? (
                                    <Badge className={`w-fit text-xs px-2.5 py-0.5 rounded-full border font-medium ${getPaymentModeBadgeColor(appointment.paymentMode)}`}>
                                        {appointment.paymentMode}
                                    </Badge>
                                ) : (
                                    <span className="text-sm text-gray-400 font-medium">Not specified</span>
                                )}
                            </InfoRow>
                        </div>
                    </div>

                    {/* ── 3. Additional Information ── */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <InfoRow label="Created" value={appointment.createdAt ? formatDate(appointment.createdAt) : "Not available"} />
                            <InfoRow label="Last Updated" value={appointment.updatedAt ? formatDate(appointment.updatedAt) : "Not available"} />

                            {/* Medical Issue — full row, only if present */}
                            {appointment.medical_issue_details && (
                                <InfoRow label="Medical Issue Details" fullRow>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                                        {appointment.medical_issue_details}
                                    </p>
                                </InfoRow>
                            )}
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
    )
}