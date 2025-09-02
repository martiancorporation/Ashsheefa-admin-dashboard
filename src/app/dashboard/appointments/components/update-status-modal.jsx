"use client"

import React from "react"
import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import appointments from "@/api/appointments"

export function UpdateStatusModal({ open, onOpenChange, appointment, onSave }) {
    const [loading, setLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("")

    // Initialize status when modal opens
    React.useEffect(() => {
        if (open && appointment) {
            setSelectedStatus(appointment.status || "")
        }
    }, [open, appointment])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedStatus.trim()) {
            toast.error("Please select a status")
            return
        }

        // Always refresh the base record to avoid missing fields
        let existingRecord = appointment
        try {
            const details = await appointments.getAppointmentDetails(appointment._id)
            // handleResponse may return data directly or within .data
            existingRecord = details?.data || details || appointment
        } catch (_) {
            // ignore and use provided appointment object
        }

        // Helper to normalize date to ISO string so backend casting works
        const normalizeDateToISO = (value) => {
            if (!value) return new Date().toISOString()
            if (value instanceof Date && !isNaN(value)) return value.toISOString()
            if (typeof value === 'string') {
                // dd/mm/yyyy
                const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
                if (m) {
                    const [, dd, mm, yyyy] = m
                    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`)
                    return isNaN(d) ? new Date().toISOString() : d.toISOString()
                }
                const d = new Date(value)
                if (!isNaN(d)) return d.toISOString()
            }
            try {
                const d = new Date(value)
                if (!isNaN(d)) return d.toISOString()
            } catch (_) { }
            return new Date().toISOString()
        }

        // Prepare fields from the freshest record
        const referDoctorValue = (String(existingRecord?.refer_doctor ?? "").trim())
        const medicalIssueValue = (String(existingRecord?.medical_issue_details ?? "").trim())
        // Use a valid enum default for gender when missing
        const genderValue = (String(existingRecord?.gender ?? "").trim()) || "Other"
        const specialityValue = (String(existingRecord?.speciality ?? "").trim())
        const patientNameValue = (String(existingRecord?.patient_full_name ?? "").trim())
        const contactNumberValue = (String(existingRecord?.contact_number ?? "").trim())
        const ageValue = existingRecord?.age != null ? String(existingRecord.age).trim() : ""
        const appointmentDateValue = normalizeDateToISO(existingRecord?.appointment_date)

        setLoading(true)
        try {
            const updateData = {
                // Required for backend validators; pulled from existing record
                patient_full_name: patientNameValue,
                contact_number: contactNumberValue,
                appointment_date: appointmentDateValue,
                status: selectedStatus.trim(),
                gender: genderValue,
            }

            // Only include optional fields if they exist to avoid enum errors
            if (referDoctorValue) updateData.refer_doctor = referDoctorValue
            if (medicalIssueValue) updateData.medical_issue_details = medicalIssueValue
            if (specialityValue) updateData.speciality = specialityValue

            // Include age only if present (backend may treat it as optional)
            if (ageValue) {
                updateData.age = ageValue
            }

            const response = await appointments.updateAppointment(appointment._id, updateData)

            if (response) {
                toast.success("Status updated successfully")
                onOpenChange(false)
                if (onSave) {
                    onSave()
                }
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("An error occurred while updating the status")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Confirmed", label: "Confirmed" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className="text-[#4B4B4B] text-base">
                            Update Appointment Status
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Appointment Info */}
                    {appointment && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Appointment Information</h3>
                            <div className="text-sm text-gray-600">
                                <p><strong>Patient:</strong> {appointment.patient_full_name}</p>
                                <p><strong>Department:</strong> {appointment.speciality}</p>
                                <p><strong>Current Status:</strong> {appointment.status || "Not set"}</p>
                            </div>
                        </div>
                    )}

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-[#4A4A4B] text-sm">
                            New Status*
                        </Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#005CD4] hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 