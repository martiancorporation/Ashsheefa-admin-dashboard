"use client";

import React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import internationalPatient from "@/api/internationalPatient";
import doctor from "@/api/doctor";

export function AddInternationalPatientModal({
  open,
  onOpenChange,
  patient,
  onSave,
  departments = [],
  departmentsLoading = false,
}) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [tempDate, setTempDate] = useState(undefined);
  const [cancellationReason, setCancellationReason] = useState("");
  const [formData, setFormData] = useState({
    patient_full_name: "",
    age: "",
    contact_number: "",
    gender: "",
    country: "",
    speciality: "",
    medical_issue_details: "",
    refer_doctor: "",
    consultant_doctor: "",
    appointment_date: "",
    passport_number: "",
    email: "",
    status: "",
  });

  // Initialize form when modal opens or patient changes
  useEffect(() => {
    if (open) {
      if (patient) {
        // Convert date to DD/MM/YYYY format for input
        const appointmentDate = patient.appointment_date
          ? new Date(patient.appointment_date).toLocaleDateString("en-GB")
          : "";

        setFormData({
          patient_full_name: patient.patient_full_name || "",
          age: patient.age?.toString() || "",
          contact_number: patient.contact_number || "",
          gender: patient.gender || "",
          country: patient.country || "",
          speciality: patient.speciality || "",
          medical_issue_details: patient.medical_issue_details || "",
          refer_doctor: patient.refer_doctor || "",
          consultant_doctor:
            patient.consultant_doctor?._id || patient.consultant_doctor || "",
          appointment_date: appointmentDate,
          passport_number: patient.passport_number || "",
          email: patient.email || "",
          status: patient.status || "",
        });
        setCancellationReason("");
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
          consultant_doctor: "",
          appointment_date: "",
          passport_number: "",
          email: "",
          status: "",
        });
        setCancellationReason("");
      }
    }
  }, [open, patient]);

  // Fetch doctors for consultant doctor dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctor.getAllDoctors(1, 200);
        setDoctors(response?.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!formData.patient_full_name.trim()) {
      toast.error("Patient full name is required");
      return;
    }
    if (!formData.contact_number.trim()) {
      toast.error("Contact number is required");
      return;
    }
    if (!formData.passport_number.trim()) {
      toast.error("Passport number is required");
      return;
    }
    if (!formData.country.trim()) {
      toast.error("Country is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.consultant_doctor.trim()) {
      toast.error("Consultant doctor is required");
      return;
    }
    // Status is only required when editing an existing patient
    if (patient && !formData.status.trim()) {
      toast.error("Status is required");
      return;
    }
    // Cancellation reason is required when status is Cancelled
    if (
      patient &&
      formData.status === "Cancelled" &&
      !cancellationReason.trim()
    ) {
      toast.error("Please enter a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      // Set tomorrow's date if no appointment date is provided
      let appointmentDate = formData.appointment_date.trim();
      if (!appointmentDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        appointmentDate = format(tomorrow, "dd/MM/yyyy");
      }

      const submitData = {
        patient_full_name: formData.patient_full_name.trim(),
        age: formData.age.trim() || null,
        contact_number: formData.contact_number.trim(),
        gender: formData.gender.trim() || null,
        country: formData.country.trim(),
        speciality: formData.speciality.trim() || null,
        medical_issue_details: formData.medical_issue_details.trim() || null,
        refer_doctor: formData.refer_doctor.trim() || null,
        consultant_doctor: formData.consultant_doctor.trim() || null,
        appointment_date: appointmentDate,
        passport_number: formData.passport_number.trim(),
        email: formData.email.trim() || null,
        ...(patient && { status: formData.status.trim() }), // Only include status when editing
        ...(patient &&
          formData.status === "Cancelled" && {
            cancellation_reason: cancellationReason.trim(),
          }),
      };

      let response;
      if (patient) {
        // Update existing patient
        response = await internationalPatient.updateInternationalPatient(
          patient._id,
          submitData,
        );
        if (response.error) {
          toast.error(response.error);
        } else if (response) {
          toast.success("International patient updated successfully");
        } else {
          toast.error("Failed to update international patient");
        }
      } else {
        // Create new patient
        response =
          await internationalPatient.addInternationalPatient(submitData);
        if (response.data) {
          toast.success("International patient added successfully");
        } else {
          toast.error(
            response.error ||
              "Failed to add international patient. Please try again.",
          );
        }
      }

      if (response) {
        // onOpenChange(false);
        if (onSave) {
          onSave();
        }
      }
    } catch (error) {
      console.error("Error saving international patient:", error);
      toast.error("An error occurred while saving the international patient");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const specialityOptions = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  //   const specialityOptions = [
  //     { value: "Ortho", label: "Orthopedics" },
  //     { value: "Cardiology", label: "Cardiology" },
  //     { value: "Neurology", label: "Neurology" },
  //     { value: "Oncology", label: "Oncology" },
  //     { value: "General Surgery", label: "General Surgery" },
  //     { value: "Cardiac Science", label: "Cardiac Science" },
  //     { value: "Dermatology", label: "Dermatology" },
  //     { value: "Pediatrics", label: "Pediatrics" },
  //     { value: "Gynecology", label: "Gynecology" },
  //     { value: "ENT", label: "ENT" },
  //     { value: "Ophthalmology", label: "Ophthalmology" },
  //     { value: "Psychiatry", label: "Psychiatry" },
  //     { value: "Radiology", label: "Radiology" },
  //     { value: "Anesthesiology", label: "Anesthesiology" },
  //     { value: "Emergency Medicine", label: "Emergency Medicine" },
  //     { value: "Internal Medicine", label: "Internal Medicine" },
  //   ];
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const countryOptions = [
    { value: "Nepal", label: "Nepal" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "China", label: "China" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "South Africa", label: "South Africa" },
    { value: "Others", label: "Others" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center">
            <button onClick={handleCancel} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <DialogTitle className={`text-[#4B4B4B] text-base`}>
              {patient
                ? "Edit International Patient"
                : "Add New International Patient"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="patient_full_name"
              className="text-[#4A4A4B] text-sm"
            >
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
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none w-full">
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

          {/* Contact Number and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="contact_number"
                className="text-[#4A4A4B] text-sm"
              >
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
            <div className="space-y-2">
              <Label htmlFor="country" className="text-[#4A4A4B] text-sm">
                Country*
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
              >
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none w-full">
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
          </div>

          {/* Passport Number and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="passport_number"
                className="text-[#4A4A4B] text-sm"
              >
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
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#4A4A4B] text-sm">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Appointment Date and Consultant Doctor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="appointment_date"
                className="text-[#4A4A4B] text-sm"
              >
                Appointment Date
              </Label>
              <Popover
                modal={true}
                open={calendarOpen}
                onOpenChange={(isOpen) => {
                  setCalendarOpen(isOpen);
                  if (isOpen) {
                    setTempDate(
                      formData.appointment_date
                        ? parse(
                            formData.appointment_date,
                            "dd/MM/yyyy",
                            new Date(),
                          )
                        : undefined,
                    );
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none ${
                      !formData.appointment_date && "text-muted-foreground"
                    }`}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.appointment_date
                      ? formData.appointment_date
                      : "Pick a date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-99" align="start">
                  <Calendar
                    mode="single"
                    selected={tempDate}
                    onSelect={setTempDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date <= today;
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Button
                      type="button"
                      className="w-full"
                      size="sm"
                      onClick={() => {
                        if (tempDate) {
                          setFormData((prev) => ({
                            ...prev,
                            appointment_date: format(tempDate, "dd/MM/yyyy"),
                          }));
                        }
                        setCalendarOpen(false);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="consultant_doctor"
                className="text-[#4A4A4B] text-sm"
              >
                Consultant Doctor*
              </Label>
              <Select
                value={formData.consultant_doctor}
                onValueChange={(value) =>
                  handleSelectChange("consultant_doctor", value)
                }
              >
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none w-full">
                  <SelectValue placeholder="Select consultant doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc._id} value={doc._id}>
                      {doc.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="speciality" className="text-[#4A4A4B] text-sm">
                Speciality
              </Label>
              <Select
                value={formData.speciality}
                onValueChange={(value) =>
                  handleSelectChange("speciality", value)
                }
                disabled={departmentsLoading}
              >
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none w-full">
                  <SelectValue
                    placeholder={
                      departmentsLoading
                        ? "Loading departments..."
                        : "Select speciality"
                    }
                  />
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
          </div>

          {/* Status - Only show when editing */}
          {patient && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#4A4A4B] text-sm">
                Status*
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none w-full">
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

          {/* Cancellation Reason - Only show when editing and status is Cancelled */}
          {patient && formData.status === "Cancelled" && (
            <div className="space-y-2">
              <Label
                htmlFor="cancellation_reason"
                className="text-[#4A4A4B] text-sm"
              >
                Reason for Cancellation*
              </Label>
              <Textarea
                id="cancellation_reason"
                name="cancellation_reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please enter the reason for cancellation..."
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none min-h-[100px]"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Medical Issue Details */}
          <div className="space-y-2">
            <Label
              htmlFor="medical_issue_details"
              className="text-[#4A4A4B] text-sm"
            >
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
              ) : patient ? (
                "Update Patient"
              ) : (
                "Create Patient"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
