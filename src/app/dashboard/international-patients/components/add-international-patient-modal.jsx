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
import internationalPatient from "@/api/internationalPatient"

export function AddInternationalPatientModal({ open, onOpenChange, patient, onSave }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        patient_full_name: "",
        age: "",
        contact_number: "",
        gender: "",
        country: "",
        speciality: "",
        medical_issue_details: "",
        refer_doctor: "",
        appointment_date: "",
        passport_number: "",
        status: "",
    })

    // Initialize form when modal opens or patient changes
    useEffect(() => {
        if (open) {
            if (patient) {
                // Convert date to DD/MM/YYYY format for input
                const appointmentDate = patient.appointment_date
                    ? new Date(patient.appointment_date).toLocaleDateString('en-GB')
                    : ""

                setFormData({
                    patient_full_name: patient.patient_full_name || "",
                    age: patient.age?.toString() || "",
                    contact_number: patient.contact_number || "",
                    gender: patient.gender || "",
                    country: patient.country || "",
                    speciality: patient.speciality || "",
                    medical_issue_details: patient.medical_issue_details || "",
                    refer_doctor: patient.refer_doctor || "",
                    appointment_date: appointmentDate,
                    passport_number: patient.passport_number || "",
                    status: patient.status || "",
                })
            } else {
                // Reset form for new patient
                setFormData({
                    patient_full_name: "",
                    age: "",
                    contact_number: "",
                    gender: "",
                    country: "",
                    speciality: "",
                    medical_issue_details: "",
                    refer_doctor: "",
                    appointment_date: "",
                    passport_number: "",
                    status: "",
                })
            }
        }
    }, [open, patient])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.patient_full_name.trim()) {
            toast.error("Patient full name is required")
            return
        }
        if (!formData.age.trim()) {
            toast.error("Age is required")
            return
        }
        if (!formData.contact_number.trim()) {
            toast.error("Contact number is required")
            return
        }
        if (!formData.gender.trim()) {
            toast.error("Gender is required")
            return
        }
        if (!formData.country.trim()) {
            toast.error("Country is required")
            return
        }
        if (!formData.speciality.trim()) {
            toast.error("Speciality is required")
            return
        }
        if (!formData.passport_number.trim()) {
            toast.error("Passport number is required")
            return
        }
        if (!formData.appointment_date.trim()) {
            toast.error("Appointment date is required")
            return
        }
        // Status is only required when editing an existing patient
        if (patient && !formData.status.trim()) {
            toast.error("Status is required")
            return
        }

        setLoading(true)
        try {
            const submitData = {
                patient_full_name: formData.patient_full_name.trim(),
                age: formData.age.trim(),
                contact_number: formData.contact_number.trim(),
                gender: formData.gender.trim(),
                country: formData.country.trim(),
                speciality: formData.speciality.trim(),
                medical_issue_details: formData.medical_issue_details.trim() || null,
                refer_doctor: formData.refer_doctor.trim() || null,
                appointment_date: formData.appointment_date.trim(),
                passport_number: formData.passport_number.trim(),
                ...(patient && { status: formData.status.trim() }), // Only include status when editing
            }

            let response
            if (patient) {
                // Update existing patient
                response = await internationalPatient.updateInternationalPatient(patient._id, submitData)
                if (response) {
                    toast.success("International patient updated successfully")
                } else {
                    toast.error("Failed to update international patient")
                }
            } else {
                // Create new patient
                response = await internationalPatient.addInternationalPatient(submitData)
                if (response) {
                    toast.success("International patient added successfully")
                } else {
                    toast.error("Failed to add international patient")
                }
            }

            if (response) {
                onOpenChange(false)
                if (onSave) {
                    onSave()
                }
            }
        } catch (error) {
            console.error("Error saving international patient:", error)
            toast.error("An error occurred while saving the international patient")
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

    const specialityOptions = [
        { value: "Ortho", label: "Ortho" },
        { value: "Cardiology", label: "Cardiology" },
        { value: "Neurology", label: "Neurology" },
        { value: "Oncology", label: "Oncology" },
        { value: "General Surgery", label: "General Surgery" },
        { value: "Dermatology", label: "Dermatology" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Gynecology", label: "Gynecology" },
        { value: "ENT", label: "ENT" },
        { value: "Ophthalmology", label: "Ophthalmology" },
        { value: "Psychiatry", label: "Psychiatry" },
        { value: "Radiology", label: "Radiology" },
        { value: "Anesthesiology", label: "Anesthesiology" },
        { value: "Emergency Medicine", label: "Emergency Medicine" },
        { value: "Internal Medicine", label: "Internal Medicine" },
    ]

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Discharged", label: "Discharged" },
    ]

    const countryOptions = [
        { value: "Nepal", label: "Nepal" },
        { value: "Bhutan", label: "Bhutan" },
        { value: "Bangladesh", label: "Bangladesh" },
        { value: "China", label: "China" },
        { value: "Pakistan", label: "Pakistan" },
        { value: "Afghanistan", label: "Afghanistan" },
        { value: "Sri Lanka", label: "Sri Lanka" },
        { value: "South Africa", label: "South Africa" },
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
                            {patient ? "Edit International Patient" : "Add New International Patient"}
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
                                Age*
                            </Label>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                required
                                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-[#4A4A4B] text-sm">
                                Gender*
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

                    {/* Country and Speciality */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-[#4A4A4B] text-sm">
                                Country*
                            </Label>
                            <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countryOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="speciality" className="text-[#4A4A4B] text-sm">
                                Speciality*
                            </Label>
                            <Select value={formData.speciality} onValueChange={(value) => handleSelectChange("speciality", value)}>
                                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                    <SelectValue placeholder="Select speciality" />
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
                    </div>

                    {/* Passport Number */}
                    <div className="space-y-2">
                        <Label htmlFor="passport_number" className="text-[#4A4A4B] text-sm">
                            Passport Number*
                        </Label>
                        <Input
                            id="passport_number"
                            name="passport_number"
                            value={formData.passport_number}
                            onChange={handleChange}
                            placeholder="Enter passport number"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Appointment Date */}
                    <div className="space-y-2">
                        <Label htmlFor="appointment_date" className="text-[#4A4A4B] text-sm">
                            Appointment Date* (DD/MM/YYYY)
                        </Label>
                        <Input
                            id="appointment_date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Status - Only show when editing */}
                    {patient && (
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
                                    {patient ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                patient ? "Update Patient" : "Create Patient"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 