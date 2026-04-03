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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";

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

    // ---------- Doctors ----------
    const [doctors, setDoctors] = useState([]);
    const doctorsFetchedRef = useRef(false); // avoid re-fetching every open

    const [doctorData, setDoctorData] = useState(null);

    // ---------- Departments ----------
    const [departments, setDepartments] = useState([]);
    const departmentsFetchedRef = useRef(false);
    const [departmentsLoading, setDepartmentsLoading] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    // ---------- Patients ----------
    const [patients, setPatients] = useState([]);
    const [patientsLoaded, setPatientsLoaded] = useState(false);
    const [useExistingPatient, setUseExistingPatient] = useState(false);

    // ---------- Slots ----------
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookedSlots, setBookedSlots] = useState(new Set());

    // ---------- Form ----------
    const [formData, setFormData] = useState({
        doctorId: "",
        patientId: "",
        patient_full_name: "",
        contact_number: "",
        gender: "",
        medical_issue_details: "",
        email: "",
        address: "",
        date_of_birth: "",
        amount: 0,
    });

    const [patientSearch, setPatientSearch] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [doctorSearch, setDoctorSearch] = useState("");
    const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
    const doctorWrapperRef = useRef(null);

    // Close doctor dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (doctorWrapperRef.current && !doctorWrapperRef.current.contains(e.target)) {
                setDoctorDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // -----------------------------------------------------------------------
    // Fetch doctors once when modal opens (guarded by ref so it only fires once
    // per component lifetime, not on every re-open)
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!open) return;
        if (doctorsFetchedRef.current) return;

        doctorsFetchedRef.current = true;
        API.doctor.getAllDoctors(1, 200).then((res) => {
            if (res?.success) {
                setDoctors(res.data || []);
            }
        });
    }, [open]);

    // -----------------------------------------------------------------------
    // Fetch departments once when modal opens
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!open) return;
        if (departmentsFetchedRef.current) return;

        departmentsFetchedRef.current = true;
        setDepartmentsLoading(true);

        API.department
            .getAllDepartments(1, 100)
            .then((response) => {
                if (response?.departments) {
                    setDepartments(
                        response.departments
                            .map((d) => d.name || d.department_name || d.label)
                            .filter(Boolean)
                    );
                } else if (response?.data) {
                    setDepartments(
                        response.data
                            .map((d) => d.name || d.department_name || d.label)
                            .filter(Boolean)
                    );
                }
            })
            .catch(() => {
                // Fallback static list
                setDepartments([
                    "General Medicine",
                    "General Surgery",
                    "Cardiology",
                    "Neurology",
                    "Neurosurgery",
                    "Orthopedics",
                    "Pediatrics",
                    "Obstetrics & Gynecology",
                    "Dermatology",
                    "Psychiatry",
                    "Ophthalmology",
                    "ENT",
                    "Oncology",
                    "Urology",
                    "Nephrology",
                    "Pulmonology",
                    "Gastroenterology",
                    "Endocrinology",
                    "Radiology",
                    "Anesthesiology",
                    "Pathology",
                    "Hematology",
                    "Rheumatology",
                    "Plastic Surgery",
                    "Cardiothoracic Surgery",
                    "Forensic Medicine",
                    "Family Medicine",
                    "Sports Medicine",
                ]);
            })
            .finally(() => setDepartmentsLoading(false));
    }, [open]);

    // -----------------------------------------------------------------------
    // Fetch doctor details only when a doctor is selected
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!formData.doctorId) return;
        API.doctor.getDoctorById(formData.doctorId).then((res) => {
            if (res) {
                setDoctorData(res);
                setFormData((prev) => ({ ...prev, amount: res?.fees ?? 0 }));
            }
        });
    }, [formData.doctorId]);

    // -----------------------------------------------------------------------
    // Filtered doctors — derived from search text + selected department
    // (pure client-side, no extra API calls)
    // -----------------------------------------------------------------------
    const filteredDoctors = useMemo(() => {
        let list = doctors;

        if (selectedDepartment) {
            list = list.filter(
                (d) =>
                    d.department?.toLowerCase() ===
                    selectedDepartment.toLowerCase()
            );
        }

        if (doctorSearch) {
            const q = doctorSearch.toLowerCase();
            list = list.filter(
                (d) =>
                    d.fullName?.toLowerCase().includes(q) ||
                    d.specialization?.toLowerCase().includes(q) ||
                    d.department?.toLowerCase().includes(q)
            );
        }

        return list;
    }, [doctors, selectedDepartment, doctorSearch]);

    // -----------------------------------------------------------------------
    // Fetch patients lazily — only once, when "Use Existing Patient" is toggled
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // Filter patients client-side on search
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!patientSearch) {
            setFilteredPatients(patients);
            return;
        }
        const q = patientSearch.toLowerCase();
        setFilteredPatients(
            patients.filter(
                (p) =>
                    p.patient_full_name?.toLowerCase().includes(q) ||
                    p.contact_number?.includes(patientSearch) ||
                    p.uhid?.toLowerCase().includes(q)
            )
        );
    }, [patientSearch, patients]);

    // -----------------------------------------------------------------------
    // Fetch booked slots — only when BOTH doctor and date are selected
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!selectedDate || !formData.doctorId) return;

        const d = new Date(selectedDate);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        API.appointments
            .getAvailableSlots(formData.doctorId, dateStr)
            .then((booked) => setBookedSlots(new Set(booked)));
    }, [selectedDate, formData.doctorId]);

    // -----------------------------------------------------------------------
    // Schedule helpers
    // -----------------------------------------------------------------------
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
            const hh = String(Math.floor(curr / 60)).padStart(2, "0");
            const mm = String(curr % 60).padStart(2, "0");
            list.push(`${hh}:${mm}`);
            curr += 30;
        }
        return list;
    }, [activeDay, normalizedAvailability]);

    // -----------------------------------------------------------------------
    // Submit
    // -----------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.doctorId) return toast.error("Select doctor");
        if (!selectedDate) return toast.error("Select date");
        if (!selectedSlot) return toast.error("Select slot");
        if (useExistingPatient && !formData.patientId)
            return toast.error("Select patient");
        if (!useExistingPatient && (!formData.patient_full_name || !formData.contact_number))
            return toast.error("Patient name & contact required");

        const d = new Date(selectedDate);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        const endMin = toMinutes(selectedSlot) + 30;
        const slotEnd = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

        const payload = {
            doctorId: formData.doctorId,
            appointment_date: dateStr,
            slot_start_time: selectedSlot,
            slot_end_time: slotEnd,
            medical_issue_details: formData.medical_issue_details,
            amount: Number(formData.amount) || 0,
            speciality: doctorData?.specialization || doctorData?.speciality || "",
        };

        if (useExistingPatient) {
            payload.patientId = formData.patientId;
            const sel = patients.find((p) => p._id === formData.patientId);
            payload.contact_number = sel?.contact_number || "";
        } else {
            payload.patient_full_name = formData.patient_full_name;
            payload.contact_number = formData.contact_number;
            payload.gender = formData.gender;
            payload.email = formData.email;
            payload.date_of_birth = dateOfBirth || "";
            payload.address = formData.address.trim();
        }

        setLoading(true);
        try {
            const res = await API.appointments.addAppointment(payload);
            if (res?.success) {
                toast.success("Appointment created");
                resetForm();
                onOpenChange(false);
                onSave?.();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create");
        }
        setLoading(false);
    };

    // -----------------------------------------------------------------------
    // Reset all form state to defaults
    // -----------------------------------------------------------------------
    const resetForm = () => {
        setFormData({
            doctorId: "",
            patientId: "",
            patient_full_name: "",
            contact_number: "",
            gender: "",
            medical_issue_details: "",
            email: "",
            address: "",
            date_of_birth: "",
            amount: 0,
        });
        setUseExistingPatient(false);
        setPatientSearch("");
        setFilteredPatients([]);
        setPatients([]);
        setPatientsLoaded(false);
        setDoctorSearch("");
        setDoctorData(null);
        setSelectedDepartment("");
        setSelectedDate(null);
        setSelectedSlot("");
        setBookedSlots(new Set());
        setDateOfBirth("");
    };

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
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
                                    amount: formData.amount || 0,
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

                            {/* Address */}
                            <div>
                                <Label className="text-sm font-medium mb-1">Address</Label>
                                <Input
                                    placeholder="Enter full address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            address: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* ---- Select Department ---- */}
                    <div>
                        <Label className="text-sm font-medium mb-1">
                            Select Department
                        </Label>
                        <Select
                            value={selectedDepartment}
                            onValueChange={(val) => {
                                setSelectedDepartment(val === "__all__" ? "" : val);
                                // Reset doctor selection when department changes
                                setFormData((prev) => ({
                                    ...prev,
                                    doctorId: "",
                                    amount: 0,
                                }));
                                setDoctorData(null);
                                setDoctorSearch("");
                                setSelectedDate(null);
                                setSelectedSlot("");
                            }}
                            disabled={departmentsLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        departmentsLoading
                                            ? "Loading departments..."
                                            : "Filter by department (optional)"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ---- Doctor Search (combobox) ---- */}
                    <div className="relative" ref={doctorWrapperRef}>
                        <Label className="text-sm font-medium mb-1">Select Doctor</Label>
                        <Input
                            placeholder={
                                selectedDepartment
                                    ? `Search doctor in ${selectedDepartment}...`
                                    : "Search doctor by name, specialization or department..."
                            }
                            value={doctorSearch}
                            onFocus={() => setDoctorDropdownOpen(true)}
                            onClick={() => setDoctorDropdownOpen(true)}
                            onChange={(e) => {
                                setDoctorSearch(e.target.value);
                                setDoctorDropdownOpen(true);
                                setFormData((prev) => ({ ...prev, doctorId: "", amount: 0 }));
                                setDoctorData(null);
                                setSelectedDate(null);
                                setSelectedSlot("");
                            }}
                            autoComplete="off"
                            className="w-full mt-1"
                        />
                        {formData.doctorId && (
                            <p className="text-xs text-green-600 mt-1 px-1">
                                ✓ Doctor selected
                            </p>
                        )}
                        {doctorDropdownOpen && !formData.doctorId && (
                            filteredDoctors.length > 0 ? (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                                    {filteredDoctors.map((doc) => (
                                        <button
                                            key={doc._id}
                                            type="button"
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 border-b border-gray-100 last:border-0"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    doctorId: doc._id,
                                                }));
                                                setDoctorSearch(doc.fullName);
                                                setDoctorDropdownOpen(false);
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
                            ) : doctorSearch ? (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg px-3 py-3">
                                    <p className="text-sm text-slate-500 text-center">
                                        No doctors found. Try different search terms.
                                    </p>
                                </div>
                            ) : null
                        )}
                    </div>

                    {/* Doctor Fee */}
                    {doctorData && (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold">Consultation Fee</p>
                                <p className="text-xs text-slate-500">
                                    (Auto-filled from doctor profile)
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900">
                                    ₹
                                </span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={formData.amount ?? 0}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            amount: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-md text-right"
                                />
                            </div>
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
                    ${selectedDate === d.iso
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

                                // Disable past slots when today is selected
                                const now = new Date();
                                const isToday =
                                    selectedDate &&
                                    new Date(selectedDate).toDateString() === now.toDateString();
                                const nowMinutes = now.getHours() * 60 + now.getMinutes();
                                const isPast = isToday && toMinutes(slot) < nowMinutes;
                                const isDisabled = isBooked || isPast;

                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-2 rounded-xl text-xs font-semibold border
                      ${isBooked
                                                ? "bg-slate-100 text-slate-300 line-through"
                                                : isPast
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                        <Button className="bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
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
