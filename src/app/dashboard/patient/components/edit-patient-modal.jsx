"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import patientApi from "@/api/patient"

export function EditPatientModal({ open, onOpenChange, patient: patientData, onSave }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patient_full_name: "",
    date_of_birth: "",
    contact_number: "",
    gender: "",
    status: "",
    country: "",
    medical_issue_details: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  })

  // Populate form when modal opens with existing patient data
  useEffect(() => {
    if (open && patientData) {
      const addr = patientData.address || {}
      const dob = patientData.date_of_birth
        ? new Date(patientData.date_of_birth).toISOString().slice(0, 10)
        : ""

      setFormData({
        patient_full_name: patientData.patient_full_name || "",
        date_of_birth: dob,
        contact_number: patientData.contact_number || "",
        gender: patientData.gender || "",
        status: patientData.status || "",
        country: addr.country || patientData.country || "",
        medical_issue_details: patientData.medical_issue_details || "",
        street: addr.street || patientData.street || "",
        city: addr.city || patientData.city || "",
        state: addr.state || patientData.state || "",
        pincode: addr.pincode || patientData.pincode || "",
      })
    }
  }, [open, patientData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patient_full_name.trim()) {
      toast.error("Patient full name is required")
      return
    }
    if (!formData.contact_number.trim()) {
      toast.error("Contact number is required")
      return
    }
    if (!formData.gender) {
      toast.error("Gender is required")
      return
    }
    if (!formData.status) {
      toast.error("Status is required")
      return
    }

    setLoading(true)
    try {
      // The backend destructures street/city/state/pincode flat from req.body
      // and applies them via dot-notation ($set: { "address.street": ... }),
      // so they must be sent at root level — NOT nested under `address: {}`.
      const submitData = {
        patient_full_name: formData.patient_full_name.trim(),
        contact_number: formData.contact_number.trim(),
        gender: formData.gender,
        status: formData.status,
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.medical_issue_details.trim() && { medical_issue_details: formData.medical_issue_details.trim() }),
        // address sub-fields sent flat
        ...(formData.street && { street: formData.street.trim() }),
        ...(formData.city && { city: formData.city.trim() }),
        ...(formData.state && { state: formData.state.trim() }),
        ...(formData.pincode && { pincode: formData.pincode.trim() }),
        ...(formData.country && { country: formData.country.trim() }),
      }

      const response = await patientApi.updatePatient(patientData._id, submitData)
      if (response) {
        toast.success("Patient updated successfully")
        onOpenChange(false)
        if (onSave) onSave()
      } else {
        toast.error("Failed to update patient")
      }
    } catch (error) {
      console.error("Error updating patient:", error)
      toast.error("An error occurred while updating the patient")
    } finally {
      setLoading(false)
    }
  }

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ]

  const statusOptions = [
    { value: "In Treatment", label: "In Treatment" },
    { value: "Discharged", label: "Discharged" },
    { value: "Under Observation", label: "Under Observation" },
    { value: "Scheduled", label: "Scheduled" },
  ]

  const countryOptions = [
    "India", "Nepal", "Bhutan", "Bangladesh", "China",
    "Pakistan", "Afghanistan", "Sri Lanka", "South Africa",
  ]

  if (!patientData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className="text-[#4B4B4B] text-base">
              Edit Patient
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
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
              className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
              disabled={loading}
            />
          </div>

          {/* Date of Birth + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-[#4A4A4B] text-sm">
                Date of Birth
              </Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[#4A4A4B] text-sm">
                Gender*
              </Label>
              <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact + Status */}
          <div className="grid grid-cols-2 gap-4">
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
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#4A4A4B] text-sm">
                Status*
              </Label>
              <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-[#4A4A4B] text-sm">Address</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
              <Input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Country */}
          {/* <div className="space-y-2">
            <Label htmlFor="country" className="text-[#4A4A4B] text-sm">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(v) => handleSelectChange("country", v)}>
              <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Medical Issue Details */}
          {/* <div className="space-y-2">
            <Label htmlFor="medical_issue_details" className="text-[#4A4A4B] text-sm">
              Medical Issue Details
            </Label>
            <Textarea
              id="medical_issue_details"
              name="medical_issue_details"
              value={formData.medical_issue_details}
              onChange={handleChange}
              placeholder="Enter medical issue details"
              className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none min-h-[90px]"
              disabled={loading}
            />
          </div> */}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#005CD4] hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : "Update Patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
