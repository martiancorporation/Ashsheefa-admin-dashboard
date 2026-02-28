"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";
import { format } from "date-fns";

const DAY_LIST = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const toMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const formatTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${suffix}`;
};

export function AddAppointmentModal({ open, onOpenChange, onSave }) {
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [doctorData, setDoctorData] = useState(null);

  const [patients, setPatients] = useState([]);
  const [patientsLoaded, setPatientsLoaded] = useState(false);

  const [useExistingPatient, setUseExistingPatient] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState(new Set());

  const [formData, setFormData] = useState({
    doctorId: "",
    patientId: "",
    patient_full_name: "",
    contact_number: "",
    gender: "",
    medical_issue_details: "",
    email: "",
    pincode: "",
    date_of_birth: "",
  });

  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Fetch doctors
  useEffect(() => {
    if (!open) return;
    API.doctor.getAllDoctors(1, 200).then((res) => {
      if (res?.success) {
        setDoctors(res.data || []);
        setFilteredDoctors(res.data || []);
      }
    });
  }, [open]);

  // Fetch doctor details
  useEffect(() => {
    if (!formData.doctorId) return;
    API.doctor.getDoctorById(formData.doctorId).then((res) => {
      if (res) {
        setDoctorData(res);
        console.log("doctorData", res);
      }
    });
  }, [formData.doctorId]);

  // Filter doctors based on search
  useEffect(() => {
    if (!doctorSearch) {
      setFilteredDoctors(doctors);
      return;
    }
    const filtered = doctors.filter(
      (d) =>
        d.fullName?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.department?.toLowerCase().includes(doctorSearch.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  }, [doctorSearch, doctors]);

  // Fetch patients when toggle ON
  useEffect(() => {
    if (!useExistingPatient) return;
    if (patientsLoaded) return;

    API.patient.getAllPatients({ page: 1, limit: 500 }).then((res) => {
      if (res?.success) {
        setPatients(res.data || []);
        setFilteredPatients(res.data || []);
        setPatientsLoaded(true);
      }
    });
  }, [useExistingPatient, patientsLoaded]);

  // Filter patients based on search
  useEffect(() => {
    if (!patientSearch) {
      setFilteredPatients(patients);
      return;
    }
    const filtered = patients.filter(
      (p) =>
        p.patient_full_name
          ?.toLowerCase()
          .includes(patientSearch.toLowerCase()) ||
        p.contact_number?.includes(patientSearch) ||
        p.uhid?.toLowerCase().includes(patientSearch.toLowerCase()),
    );
    setFilteredPatients(filtered);
  }, [patientSearch, patients]);

  // Fetch booked slots
  useEffect(() => {
    if (!selectedDate || !formData.doctorId) return;

    const d = new Date(selectedDate);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;

    API.appointments
      .getAvailableSlots(formData.doctorId, dateStr)
      .then((booked) => {
        setBookedSlots(new Set(booked));
      });
  }, [selectedDate, formData.doctorId]);

  const normalizedAvailability = useMemo(() => {
    return (doctorData?.availability ?? [])
      .filter((a) => a.isAvailable)
      .map((a) => ({ ...a, day: a.day?.toLowerCase() }));
  }, [doctorData]);

  const next7Days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = DAY_LIST[d.getDay()];
      const isAvailable = normalizedAvailability.some((a) => a.day === dayName);

      return {
        iso: d.toDateString(),
        label: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        isAvailable,
      };
    });
  }, [normalizedAvailability]);

  const activeDay = useMemo(() => {
    if (!selectedDate) return "";
    const d = new Date(selectedDate);
    return DAY_LIST[d.getDay()];
  }, [selectedDate]);

  const slots = useMemo(() => {
    if (!activeDay) return [];
    const entry = normalizedAvailability.find((a) => a.day === activeDay);
    if (!entry) return [];

    const start = toMinutes(entry.startTime);
    const end = toMinutes(entry.endTime);

    const list = [];
    let curr = start;
    while (curr < end) {
      const hh = String(Math.floor(curr / 60)).padStart(2, "0");
      const mm = String(curr % 60).padStart(2, "0");
      list.push(`${hh}:${mm}`);
      curr += 30;
    }
    return list;
  }, [activeDay, normalizedAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId) return toast.error("Select doctor");
    if (!selectedDate) return toast.error("Select date");
    if (!selectedSlot) return toast.error("Select slot");

    if (useExistingPatient && !formData.patientId)
      return toast.error("Select patient");

    if (
      !useExistingPatient &&
      (!formData.patient_full_name || !formData.contact_number)
    )
      return toast.error("Patient name & contact required");

    const d = new Date(selectedDate);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;

    const endMin = toMinutes(selectedSlot) + 30;
    const slotEnd = `${String(Math.floor(endMin / 60)).padStart(
      2,
      "0",
    )}:${String(endMin % 60).padStart(2, "0")}`;

    const payload = {
      doctorId: formData.doctorId,
      appointment_date: dateStr,
      slot_start_time: selectedSlot,
      slot_end_time: slotEnd,
      medical_issue_details: formData.medical_issue_details,
      amount: doctorData?.consultationFee || 0,
      speciality: doctorData?.specialization || doctorData?.speciality || "",
    };

    if (useExistingPatient) {
      payload.patientId = formData.patientId;
      const selectedPatient = patients.find(
        (p) => p._id === formData.patientId,
      );
      payload.contact_number = selectedPatient?.contact_number || "";
    } else {
      payload.patient_full_name = formData.patient_full_name;
      payload.contact_number = formData.contact_number;
      payload.gender = formData.gender;
      payload.email = formData.email;
      payload.date_of_birth = dateOfBirth || "";
      payload.pincode = formData.pincode;
    }

    console.log("Appointment payload:", payload);
    setLoading(true);
    try {
      const res = await API.appointments.addAppointment(payload);
      if (res?.success) {
        toast.success("Appointment created");
        onOpenChange(false);
        onSave?.();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Appointment (Admin)</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Toggle */}
          <div className="flex items-center justify-between border rounded-xl p-4 bg-slate-50">
            <div>
              <Label className="font-semibold text-sm">
                Use Existing Patient
              </Label>
              <p className="text-xs text-slate-500">
                Toggle to select from patient records
              </p>
            </div>
            <Switch
              checked={useExistingPatient}
              onCheckedChange={(val) => {
                setUseExistingPatient(val);
                setFormData({
                  doctorId: formData.doctorId,
                  patientId: "",
                  patient_full_name: "",
                  contact_number: "",
                  age: "",
                  gender: "",
                  medical_issue_details: "",
                });
              }}
            />
          </div>

          {/* Existing Patient Search */}
          {useExistingPatient && (
            <div className="relative">
              <Input
                placeholder="Search by name, phone, or UHID..."
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setFormData((prev) => ({ ...prev, patientId: "" }));
                }}
                autoComplete="off"
                className="w-full"
              />
              {formData.patientId && (
                <p className="text-xs text-green-600 mt-1 px-1">
                  ✓ Patient selected
                </p>
              )}
              {filteredPatients.length > 0 &&
                patientSearch &&
                !formData.patientId && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {filteredPatients.map((p) => (
                      <button
                        key={p._id}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            patientId: p._id,
                          }));
                          setPatientSearch(p.patient_full_name);
                        }}
                      >
                        <span className="font-medium">
                          {p.patient_full_name}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {p.contact_number} · {p.uhid}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              {filteredPatients.length === 0 && patientSearch && (
                <p className="text-sm text-slate-500 text-center py-2">
                  No patients found. Try different search terms.
                </p>
              )}
            </div>
          )}

          {/* New Patient Form */}
          {!useExistingPatient && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ Enter the details of the patient visiting the doctor.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter full name"
                  value={formData.patient_full_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      patient_full_name: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1">
                    Date of Birth
                  </Label>
                  <input
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    min="1900-01-01"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, gender: v }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +91
                    </span>
                    <Input
                      placeholder="Mobile number"
                      value={formData.contact_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contact_number: e.target.value,
                        }))
                      }
                      className="rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1">Email ID</Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-1">Pincode</Label>
                <Input
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  className="w-full"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Doctor Search */}
          <div className="relative">
            <Input
              placeholder="Search doctor by name, specialization or department..."
              value={doctorSearch}
              onChange={(e) => {
                setDoctorSearch(e.target.value);
                setFormData((prev) => ({ ...prev, doctorId: "" }));
                setDoctorData(null);
                setSelectedDate(null);
                setSelectedSlot("");
              }}
              autoComplete="off"
              className="w-full"
            />
            {formData.doctorId && (
              <p className="text-xs text-green-600 mt-1 px-1">
                ✓ Doctor selected
              </p>
            )}
            {filteredDoctors.length > 0 &&
              doctorSearch &&
              !formData.doctorId && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                  {filteredDoctors.map((doc) => (
                    <button
                      key={doc._id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, doctorId: doc._id }));
                        setDoctorSearch(doc.fullName);
                        setSelectedDate(null);
                        setSelectedSlot("");
                      }}
                    >
                      <span className="font-medium">{doc.fullName}</span>
                      {(doc.specialization || doc.department) && (
                        <span className="text-xs text-slate-500 ml-2">
                          {[doc.specialization, doc.department]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            {filteredDoctors.length === 0 &&
              doctorSearch &&
              !formData.doctorId && (
                <p className="text-sm text-slate-500 text-center py-2">
                  No doctors found. Try different search terms.
                </p>
              )}
          </div>

          {/* Doctor Fee */}
          {doctorData && (
            <div className="p-4 rounded-xl border bg-blue-50 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Consultation Fee</p>
                <p className="text-xs text-slate-500">
                  Auto-filled from doctor profile
                </p>
              </div>
              <span className="text-lg font-bold text-blue-600">
                ₹{doctorData?.consultationFee || 0}
              </span>
            </div>
          )}

          {/* Date Strip */}
          {formData.doctorId && (
            <div className="flex gap-2 overflow-x-auto">
              {next7Days.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={!d.isAvailable}
                  onClick={() => {
                    setSelectedDate(d.iso);
                    setSelectedSlot("");
                  }}
                  className={`px-3 py-2 rounded-xl border text-sm
                    ${
                      selectedDate === d.iso
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-slate-200"
                    }
                    ${!d.isAvailable && "opacity-30 cursor-not-allowed"}
                  `}
                >
                  {d.label} {d.month}
                </button>
              ))}
            </div>
          )}

          {/* Slots */}
          {selectedDate && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isBooked = bookedSlots.has(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl text-xs font-semibold border
                      ${
                        isBooked
                          ? "bg-slate-100 text-slate-300 line-through"
                          : isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white border-slate-200 hover:border-blue-400"
                      }
                    `}
                  >
                    {formatTime(slot)}
                  </button>
                );
              })}
            </div>
          )}

          <Textarea
            placeholder="Medical Issue Details"
            value={formData.medical_issue_details}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                medical_issue_details: e.target.value,
              }))
            }
          />

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Create Appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
