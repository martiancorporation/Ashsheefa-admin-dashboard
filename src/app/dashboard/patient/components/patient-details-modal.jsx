"use client"

import React from "react"
import { User, Phone, Calendar, MapPin, Stethoscope, FileText, UserCheck, Hash, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function PatientDetailsModal({ patient, onClose, onSave }) {

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Calculate age from a date-of-birth string
    const calculateAge = (dob) => {
        if (!dob) return "Not specified"
        const birth = new Date(dob)
        if (isNaN(birth.getTime())) return "Not specified"
        const now = new Date()
        let age = now.getFullYear() - birth.getFullYear()
        const monthDiff = now.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
            age--
        }
        return `${age} yrs`
    }

    // Build a human-readable address from the address object or flat fields
    const buildAddress = (p) => {
        const addr = p.address || {}
        const parts = [
            addr.street || p.street,
            addr.city || p.city,
            addr.state || p.state,
            addr.pincode || p.pincode,
            addr.country || p.country,
        ].filter(Boolean)
        return parts.length > 0 ? parts.join(", ") : null
    }

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case "in treatment": return "bg-blue-100 text-blue-800 border-blue-200"
            case "discharged": return "bg-green-100 text-green-800 border-green-200"
            case "under observation": return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "scheduled": return "bg-purple-100 text-purple-800 border-purple-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    if (!patient) return null

    // Reusable label + value row
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

    const address = buildAddress(patient)

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[#4B4B4B] text-base">
                        Patient Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 pb-1">

                    {/* ── 1. UHID ── */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <Hash className="h-3 w-3" /> Patient UHID
                            </span>
                            <p className="text-lg font-mono font-semibold text-blue-700 tracking-wider">
                                {patient.uhid || "Not assigned"}
                            </p>
                        </div>
                        <Badge className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeColor(patient.status)}`}>
                            {patient.status || "Not set"}
                        </Badge>
                    </div>

                    {/* ── 2. Patient Information ── */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <User className="h-3.5 w-3.5" />
                            Patient Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <InfoRow label="Full Name" value={patient.patient_full_name} />

                            {/* Date of Birth + calculated age */}
                            <InfoRow label="Date of Birth">
                                <span className="text-sm text-gray-800 font-medium flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    {patient.date_of_birth
                                        ? `${formatDate(patient.date_of_birth)} (${calculateAge(patient.date_of_birth)})`
                                        : "Not specified"}
                                </span>
                            </InfoRow>

                            <InfoRow label="Gender" value={patient.gender} />
                            <InfoRow label="Contact Number" value={patient.contact_number} icon={Phone} />

                            {patient.country && (
                                <InfoRow label="Country" value={patient.country} icon={Globe} />
                            )}

                            {/* Address — full row if present */}
                            {address && (
                                <InfoRow label="Address" fullRow>
                                    <span className="text-sm text-gray-800 font-medium flex items-start gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                                        {address}
                                    </span>
                                </InfoRow>
                            )}
                        </div>
                    </div>

                    {/* ── 3. Medical Information ── */}
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Stethoscope className="h-3.5 w-3.5" />
                            Medical Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <InfoRow label="Department" value={patient.speciality} icon={MapPin} />
                            <InfoRow label="Refer Doctor" value={patient.refer_doctor} icon={Stethoscope} />

                            {patient.medical_issue_details && (
                                <InfoRow label="Medical Issue Details" fullRow>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                                        {patient.medical_issue_details}
                                    </p>
                                </InfoRow>
                            )}
                        </div>
                    </div>

                    {/* ── 4. Additional Information ── */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <InfoRow label="Created" value={patient.createdAt ? formatDate(patient.createdAt) : "Not available"} />
                            <InfoRow label="Last Updated" value={patient.updatedAt ? formatDate(patient.updatedAt) : "Not available"} />
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