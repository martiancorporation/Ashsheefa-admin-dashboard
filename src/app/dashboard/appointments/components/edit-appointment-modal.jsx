"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAY_LIST = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

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

const toDateInput = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
};

const APPOINTMENT_STATUSES = ["Pending", "In Progress", "Confirmed", "Cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "abandoned"];

// ─── Component ─────────────────────────────────────────────────────────────────
export function EditAppointmentModal({ open, onOpenChange, appointment, onSave }) {
  const [loading, setLoading] = useState(false);

  // ── Doctor picker ──────────────────────────────────────────────────────────
  const [allDoctors, setAllDoctors] = useState([]);
  const doctorsFetchedRef = useRef(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const doctorWrapperRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (doctorWrapperRef.current && !doctorWrapperRef.current.contains(e.target)) {
        setDoctorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Departments ────────────────────────────────────────────────────────────
  const [departments, setDepartments] = useState([]);
  const deptFetchedRef = useRef(false);
  const [deptLoading, setDeptLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // ── Slot picker ────────────────────────────────────────────────────────────
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState(new Set());

  // ── Form fields ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    patient_full_name: "",
    date_of_birth: "",
    gender: "",
    email: "",
    contact_number: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    medical_issue_details: "",
    speciality: "",
    refer_doctor: "",
    amount: 0,
    status: "",
  });

  // ── Initialise from appointment prop ──────────────────────────────────────
  useEffect(() => {
    if (!open || !appointment) return;

    const pat = appointment.patientId || {};
    const doc = appointment.doctorId || {};

    // Seed the form immediately with what the list response already has,
    // so the modal feels instant while the full patient fetch is in flight.
    setForm({
      patient_full_name: pat.patient_full_name || appointment.patient_full_name || "",
      date_of_birth: toDateInput(pat.date_of_birth || appointment.date_of_birth),
      gender: pat.gender || appointment.gender || "",
      email: pat.email || appointment.email || "",
      contact_number: pat.contact_number || appointment.contact_number || "",
      address: {
        street: pat.address?.street || "",
        city: pat.address?.city || "",
        state: pat.address?.state || "",
        pincode: pat.address?.pincode || "",
      },
      medical_issue_details: appointment.medical_issue_details || "",
      speciality: appointment.speciality || doc.specialization || "",
      refer_doctor: appointment.refer_doctor || "",
      amount: appointment.amount ?? 0,
      status: appointment.status || "",
    });

    // pre-fill doctor
    const docId = typeof appointment.doctorId === "object"
      ? appointment.doctorId._id
      : appointment.doctorId;
    setSelectedDoctorId(docId || "");
    setDoctorSearch(doc.fullName || "");
    setSelectedDepartment(doc.department || "");

    // pre-fill date & slot
    const apptDate = appointment.appointment_date
      ? new Date(appointment.appointment_date)
      : null;
    setSelectedDate(apptDate ? apptDate.toDateString() : null);
    setSelectedSlot(appointment.slot_start_time || "");

    // ── Fetch full patient record to get email + address.pincode ─────────────
    // The list API only populates a subset of patient fields, so email and
    // pincode are often missing. We fetch them separately and apply on top.
    const patientId = pat._id || appointment.patientId;
    if (patientId) {
      API.patient.getPatientDataById(patientId).then((res) => {
        // API may return the patient directly or nested under .data
        const fullPat = res?.data?.patient || res?.data || res;
        if (fullPat && fullPat._id) {
          setForm((prev) => ({
            ...prev,
            email: fullPat.email || prev.email || "",
            address: {
              street: fullPat.address?.street || prev.address?.street || "",
              city: fullPat.address?.city || prev.address?.city || "",
              state: fullPat.address?.state || prev.address?.state || "",
              pincode: fullPat.address?.pincode || prev.address?.pincode || "",
            },
            patient_full_name: fullPat.patient_full_name || prev.patient_full_name,
            date_of_birth: toDateInput(fullPat.date_of_birth) || prev.date_of_birth,
            gender: fullPat.gender || prev.gender,
            contact_number: fullPat.contact_number || prev.contact_number,
          }));
        }
      }).catch(() => {
        // Silently ignore — form already has whatever the list gave us
      });
    }
  }, [open, appointment]);

  // ── Fetch doctors once ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (doctorsFetchedRef.current) return;
    doctorsFetchedRef.current = true;

    API.doctor.getAllDoctors(1, 200).then((res) => {
      if (res?.success) setAllDoctors(res.data || []);
    });
  }, [open]);

  // ── Fetch departments once ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (deptFetchedRef.current) return;
    deptFetchedRef.current = true;
    setDeptLoading(true);

    API.department
      .getAllDepartments(1, 100)
      .then((res) => {
        const list = res?.departments || res?.data || [];
        setDepartments(
          list.map((d) => d.name || d.department_name || d.label).filter(Boolean)
        );
      })
      .catch(() =>
        setDepartments([
          "General Medicine", "General Surgery", "Cardiology", "Neurology",
          "Neurosurgery", "Orthopedics", "Pediatrics", "Obstetrics & Gynecology",
          "Dermatology", "Psychiatry", "Ophthalmology", "ENT", "Oncology",
          "Urology", "Nephrology", "Pulmonology", "Gastroenterology",
          "Endocrinology", "Radiology", "Anesthesiology", "Pathology",
          "Hematology", "Rheumatology", "Plastic Surgery", "Cardiothoracic Surgery",
          "Forensic Medicine", "Family Medicine", "Sports Medicine",
        ])
      )
      .finally(() => setDeptLoading(false));
  }, [open]);

  // ── Load selected doctor's availability when doctorId changes ─────────────
  useEffect(() => {
    if (!selectedDoctorId) { setDoctorData(null); return; }
    API.doctor.getDoctorById(selectedDoctorId).then((res) => {
      if (res) setDoctorData(res);
    });
  }, [selectedDoctorId]);

  // ── Fetch booked slots ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedDate || !selectedDoctorId) return;
    const d = new Date(selectedDate);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    API.appointments
      .getAvailableSlots(selectedDoctorId, dateStr)
      .then((booked) => setBookedSlots(new Set(booked)));
  }, [selectedDate, selectedDoctorId]);

  // ── Filtered doctor list ───────────────────────────────────────────────────
  const filteredDoctors = useMemo(() => {
    let list = allDoctors;
    if (selectedDepartment) {
      list = list.filter(
        (d) => d.department?.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }
    if (doctorSearch && !selectedDoctorId) {
      const q = doctorSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.fullName?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.department?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allDoctors, selectedDepartment, doctorSearch, selectedDoctorId]);

  // ── Availability & slot generation ────────────────────────────────────────
  const normalizedAvailability = useMemo(() =>
    (doctorData?.availability ?? [])
      .filter((a) => a.isAvailable)
      .map((a) => ({ ...a, day: a.day?.toLowerCase() })),
    [doctorData]
  );

  const next14Days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...Array(14)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = DAY_LIST[d.getDay()];
      return {
        iso: d.toDateString(),
        label: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        isAvailable: normalizedAvailability.some((a) => a.day === dayName),
      };
    });
  }, [normalizedAvailability]);

  const activeDay = useMemo(() => {
    if (!selectedDate) return "";
    return DAY_LIST[new Date(selectedDate).getDay()];
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
      list.push(`${String(Math.floor(curr / 60)).padStart(2, "0")}:${String(curr % 60).padStart(2, "0")}`);
      curr += 30;
    }
    return list;
  }, [activeDay, normalizedAvailability]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointment?._id) return;

    // Build date string from selectedDate
    let appointmentDateStr;
    if (selectedDate) {
      const d = new Date(selectedDate);
      appointmentDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    } else {
      // keep original
      appointmentDateStr = appointment.appointment_date;
    }

    // Build slot_end_time (+30 min)
    let slotEndTime = appointment.slot_end_time || "";
    if (selectedSlot) {
      const endMin = toMinutes(selectedSlot) + 30;
      slotEndTime = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
    }

    const payload = {
      // Patient fields
      patient_full_name: form.patient_full_name || undefined,
      date_of_birth: form.date_of_birth || undefined,
      gender: form.gender || undefined,
      email: form.email || undefined,
      contact_number: form.contact_number || undefined,
      address: {
        street: form.address?.street || "",
        city: form.address?.city || "",
        state: form.address?.state || "",
        pincode: form.address?.pincode || "",
      },

      // Appointment fields
      doctorId: selectedDoctorId || undefined,
      appointment_date: appointmentDateStr || undefined,
      slot_start_time: selectedSlot || undefined,
      slot_end_time: slotEndTime || undefined,
      medical_issue_details: form.medical_issue_details || undefined,
      speciality: form.speciality || undefined,
      refer_doctor: form.refer_doctor || undefined,
      amount: Number(form.amount) || undefined,
      status: form.status || undefined,
    };

    setLoading(true);
    try {
      const res = await API.appointments.updateAppointment(appointment._id, payload);
      if (res?.success || res?.data) {
        toast.success("Appointment updated successfully");
        onOpenChange(false);
        onSave?.();
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Patient Info ─────────────────────────────────────── */}
          <div className="border rounded-xl p-4 space-y-4 bg-slate-50">
            <p className="text-sm font-semibold text-slate-700">Patient Details</p>

            <div>
              <Label className="text-sm font-medium">Full Name</Label>
              <Input
                className="mt-1"
                value={form.patient_full_name}
                onChange={(e) => setField("patient_full_name", e.target.value)}
                placeholder="Patient full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Date of Birth</Label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  min="1900-01-01"
                  value={form.date_of_birth}
                  onChange={(e) => setField("date_of_birth", e.target.value)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setField("gender", v)}>
                  <SelectTrigger className="mt-1 w-full">
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
                <Label className="text-sm font-medium">Contact Number</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">+91</span>
                  <Input
                    className="rounded-l-none"
                    value={form.contact_number}
                    onChange={(e) => setField("contact_number", e.target.value)}
                    maxLength={10}
                    placeholder="Mobile number"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Email address"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Address</Label>
              <Input
                className="mt-1"
                placeholder="Street / House No."
                value={form.address?.street || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="City"
                  value={form.address?.city || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                />
                <Input
                  placeholder="State"
                  value={form.address?.state || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                />
              </div>
              <Input
                className="w-40"
                placeholder="Pincode *"
                value={form.address?.pincode || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
                maxLength={10}
              />
            </div>
          </div>

          {/* ── Appointment Details ───────────────────────────────── */}
          <div className="border rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-slate-700">Appointment Details</p>

            {/* Department filter */}
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={(val) => {
                  setSelectedDepartment(val === "__all__" ? "" : val);
                  setSelectedDoctorId("");
                  setDoctorSearch("");
                  setDoctorData(null);
                  setSelectedDate(null);
                  setSelectedSlot("");
                }}
                disabled={deptLoading}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder={deptLoading ? "Loading..." : "Filter by department"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor combobox */}
            <div ref={doctorWrapperRef} className="relative">
              <Label className="text-sm font-medium">Doctor</Label>
              <Input
                className="mt-1 w-full"
                placeholder={selectedDepartment ? `Search in ${selectedDepartment}...` : "Search doctor by name or specialization..."}
                value={doctorSearch}
                autoComplete="off"
                onFocus={() => setDoctorDropdownOpen(true)}
                onClick={() => setDoctorDropdownOpen(true)}
                onChange={(e) => {
                  setDoctorSearch(e.target.value);
                  setDoctorDropdownOpen(true);
                  setSelectedDoctorId("");
                  setDoctorData(null);
                  setSelectedDate(null);
                  setSelectedSlot("");
                }}
              />
              {selectedDoctorId && (
                <p className="text-xs text-green-600 mt-1 px-1">✓ Doctor selected</p>
              )}
              {doctorDropdownOpen && !selectedDoctorId && (
                filteredDoctors.length > 0 ? (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredDoctors.map((doc) => (
                      <button
                        key={doc._id}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setSelectedDoctorId(doc._id);
                          setDoctorSearch(doc.fullName);
                          setDoctorDropdownOpen(false);
                          setSelectedDate(null);
                          setSelectedSlot("");
                          setField("speciality", doc.specialization || "");
                        }}
                      >
                        <span className="font-medium">{doc.fullName}</span>
                        {(doc.specialization || doc.department) && (
                          <span className="text-xs text-slate-500 ml-2">
                            {[doc.specialization, doc.department].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : doctorSearch ? (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg px-3 py-3">
                    <p className="text-sm text-slate-500 text-center">No doctors found.</p>
                  </div>
                ) : null
              )}
            </div>

            {/* Date strip — shown only when a doctor is selected */}
            {selectedDoctorId && (
              <div>
                <Label className="text-sm font-medium">Appointment Date</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {next14Days.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={!d.isAvailable}
                      onClick={() => { setSelectedDate(d.iso); setSelectedSlot(""); }}
                      className={`px-3 py-2 rounded-xl border text-sm
                        ${selectedDate === d.iso
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-slate-200 hover:border-blue-300"}
                        ${!d.isAvailable && "opacity-30 cursor-not-allowed"}`}
                    >
                      {d.label} {d.month}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slots */}
            {selectedDate && slots.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Time Slot</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {slots.map((slot) => {
                    const isBooked = bookedSlots.has(slot) && slot !== appointment?.slot_start_time;
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-xl text-xs font-semibold border
                                                    ${isBooked
                            ? "bg-slate-100 text-slate-300 line-through"
                            : isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white border-slate-200 hover:border-blue-400"}`}
                      >
                        {formatTime(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consultation fee */}
            <div>
              <Label className="text-sm font-medium">Consultation Fee (₹)</Label>
              <Input
                className="mt-1 w-40"
                type="number"
                min={0}
                value={form.amount}
                onChange={(e) => setField("amount", e.target.value)}
              />
            </div>

            {/* Medical issue */}
            <div>
              <Label className="text-sm font-medium">Medical Issue Details</Label>
              <Textarea
                className="mt-1"
                placeholder="Describe the medical issue..."
                value={form.medical_issue_details}
                onChange={(e) => setField("medical_issue_details", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Speciality</Label>
                <Input
                  className="mt-1"
                  value={form.speciality}
                  onChange={(e) => setField("speciality", e.target.value)}
                  placeholder="e.g. Cardiology"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Refer Doctor</Label>
                <Input
                  className="mt-1"
                  value={form.refer_doctor}
                  onChange={(e) => setField("refer_doctor", e.target.value)}
                  placeholder="Referred doctor name"
                />
              </div>
            </div>
          </div>

          {/* ── Status ───────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Appointment Status</Label>
              <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
