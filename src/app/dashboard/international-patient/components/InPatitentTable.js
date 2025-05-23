"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InPatitentTable({ searchQuery, activeFilters }) {
  // Mock patient data
  const [patients] = useState([
    {
      id: 1,
      uhid: "123456",
      name: "John Smith",
      age: 28,
      gender: "Male",
      country: "USA",
      passportNumber: "P123456",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Upcoming",
    },
    {
      id: 2,
      uhid: "123457",
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      country: "UK",
      passportNumber: "P789012",
      department: "Cardiology",
      referralDoctor: "Dr. Wilson",
      appointmentDate: "15 Jan 2025",
      status: "Completed",
    },
    {
      id: 3,
      uhid: "123458",
      name: "Michael Chen",
      age: 45,
      gender: "Male",
      country: "China",
      passportNumber: "P345678",
      department: "Neurology",
      referralDoctor: "Dr. Brown",
      appointmentDate: "20 Jan 2025",
      status: "Upcoming",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "text-blue-600";
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-600";
      case "Completed":
        return "bg-green-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.passportNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!activeFilters?.department ||
        patient.department === activeFilters.department) &&
      (!activeFilters?.status || patient.status === activeFilters.status) &&
      (!activeFilters?.gender || patient.gender === activeFilters.gender);

    return matchesSearch && matchesFilters;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[#7F7F7F] font-normal">No.</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">UHID</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">Name</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">Age</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">Gender</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">Country</TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">
            Passport No.
          </TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">
            Department
          </TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">
            Referral Doctor
          </TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">
            Appointment Date
          </TableHead>
          <TableHead className="text-[#7F7F7F] font-normal">Status</TableHead>
          <TableHead className="text-[#7F7F7F] text-center font-normal">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPatients.map((patient, index) => (
          <TableRow key={patient.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{patient.uhid}</TableCell>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.country}</TableCell>
            <TableCell>{patient.passportNumber}</TableCell>
            <TableCell>{patient.department}</TableCell>
            <TableCell>{patient.referralDoctor}</TableCell>
            <TableCell>{patient.appointmentDate}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusDot(
                    patient.status
                  )}`}
                />
                <span className={getStatusColor(patient.status)}>
                  {patient.status}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center gap-2">
                <Link href={`/dashboard/international-patient/${patient.id}`}>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                </Link>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Pencil className="h-4 w-4 text-blue-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
