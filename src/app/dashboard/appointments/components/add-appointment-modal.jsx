"use client"

import React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import appointments from "@/api/appointments"

export function AddAppointmentModal({ open, onOpenChange, appointment, onSave, departments = [], departmentsLoading = false }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        patient_full_name: "",
        age: "",
        contact_number: "",
        gender: "",
        speciality: "",
        medical_issue_details: "",
        refer_doctor: "",
        appointment_date: "",
        status: "",
    })

    // Initialize form when modal opens or appointment changes
    useEffect(() => {
        if (open) {
            if (appointment) {
                // Convert date to DD/MM/YYYY format for input
                const appointmentDate = appointment.appointment_date
                    ? new Date(appointment.appointment_date).toLocaleDateString('en-GB')
                    : ""

                setFormData({
                    patient_full_name: appointment.patient_full_name || "",
                    age: appointment.age?.toString() || "",
                    contact_number: appointment.contact_number || "",
                    gender: appointment.gender || "",
                    speciality: appointment.speciality || "",
                    medical_issue_details: appointment.medical_issue_details || "",
                    refer_doctor: appointment.refer_doctor || "",
                    appointment_date: appointmentDate,
                    status: appointment.status || "",
                })
            } else {
                // Reset form for new appointment with current date as default
                const today = new Date().toLocaleDateString('en-GB')
                setFormData({
                    patient_full_name: "",
                    age: "",
                    contact_number: "",
                    gender: "",
                    speciality: "",
                    medical_issue_details: "",
                    refer_doctor: "",
                    appointment_date: today,
                    status: "",
                })
            }
        }
    }, [open, appointment])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation for required fields
        if (!formData.patient_full_name.trim()) {
            toast.error("Patient full name is required")
            return
        }
        if (!formData.contact_number.trim()) {
            toast.error("Contact number is required")
            return
        }
        // Status is only required when editing an existing appointment
        if (appointment && !formData.status.trim()) {
            toast.error("Status is required")
            return
        }

        setLoading(true)
        try {
            // Set current date if no appointment date is provided
            let appointmentDate = formData.appointment_date.trim()
            if (!appointmentDate) {
                const today = new Date()
                appointmentDate = today.toLocaleDateString('en-GB') // DD/MM/YYYY format
            }

            // Build submit data object, only including fields with values
            const submitData = {
                patient_full_name: formData.patient_full_name.trim(),
                contact_number: formData.contact_number.trim(),
                appointment_date: appointmentDate,
            }

            // Only add optional fields if they have values
            if (formData.age.trim()) {
                submitData.age = formData.age.trim()
            }
            if (formData.gender.trim()) {
                submitData.gender = formData.gender.trim()
            }
            if (formData.speciality.trim()) {
                submitData.speciality = formData.speciality.trim()
            }
            if (formData.medical_issue_details.trim()) {
                submitData.medical_issue_details = formData.medical_issue_details.trim()
            }
            if (formData.refer_doctor.trim()) {
                submitData.refer_doctor = formData.refer_doctor.trim()
            }

            // Only include status when editing
            if (appointment && formData.status.trim()) {
                submitData.status = formData.status.trim()
            }

            let response
            if (appointment) {
                // Update existing appointment
                response = await appointments.updateAppointment(appointment._id, submitData)
                if (response) {
                    toast.success("Appointment updated successfully")
                } else {
                    toast.error("Failed to update appointment")
                }
            } else {
                // Create new appointment
                response = await appointments.addAppointment(submitData)
                if (response) {
                    toast.success("Appointment added successfully")
                } else {
                    toast.error("Failed to add appointment")
                }
            }

            if (response) {
                onOpenChange(false)
                if (onSave) {
                    onSave()
                }
            }
        } catch (error) {
            console.error("Error saving appointment:", error)
            toast.error("An error occurred while saving the appointment")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
    ]

    const specialityOptions = departments.map(dept => ({
        value: dept,
        label: dept
    }))

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Confirmed", label: "Confirmed" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className={`text-[#4B4B4B] text-base`}>
                            {appointment ? "Edit Appointment" : "Add New Appointment"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="patient_full_name" className="text-[#4A4A4B] text-sm">
                            Patient Full Name*
                        </Label>
                        <Input
                            id="patient_full_name"
                            name="patient_full_name"
                            value={formData.patient_full_name}
                            onChange={handleChange}
                            placeholder="Enter patient's full name"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Age and Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age" className="text-[#4A4A4B] text-sm">
                                Age
                            </Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-[#4A4A4B] text-sm">
                                Gender
                            </Label>
                            <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genderOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                        <Label htmlFor="contact_number" className="text-[#4A4A4B] text-sm">
                            Contact Number*
                        </Label>
                        <Input
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Speciality */}
                    <div className="space-y-2">
                        <Label htmlFor="speciality" className="text-[#4A4A4B] text-sm">
                            Speciality
                        </Label>
                        <Select
                            value={formData.speciality}
                            onValueChange={(value) => handleSelectChange("speciality", value)}
                            disabled={departmentsLoading}
                        >
                            <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select speciality"} />
                            </SelectTrigger>
                            <SelectContent>
                                {specialityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Appointment Date */}
                    <div className="space-y-2">
                        <Label htmlFor="appointment_date" className="text-[#4A4A4B] text-sm">
                            Appointment Date (DD/MM/YYYY) - Leave empty for current date
                        </Label>
                        <Input
                            id="appointment_date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY (optional)"
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Status - Only show when editing */}
                    {appointment && (
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-[#4A4A4B] text-sm">
                                Status*
                            </Label>
                            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
                    )}

                    {/* Refer Doctor */}
                    <div className="space-y-2">
                        <Label htmlFor="refer_doctor" className="text-[#4A4A4B] text-sm">
                            Refer Doctor
                        </Label>
                        <Input
                            id="refer_doctor"
                            name="refer_doctor"
                            value={formData.refer_doctor}
                            onChange={handleChange}
                            placeholder="Enter referring doctor's name"
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Medical Issue Details */}
                    <div className="space-y-2">
                        <Label htmlFor="medical_issue_details" className="text-[#4A4A4B] text-sm">
                            Medical Issue Details
                        </Label>
                        <Textarea
                            id="medical_issue_details"
                            name="medical_issue_details"
                            value={formData.medical_issue_details}
                            onChange={handleChange}
                            placeholder="Enter medical issue details"
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none min-h-[100px]"
                            disabled={loading}
                        />
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
                                    {appointment ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                appointment ? "Update Appointment" : "Create Appointment"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 