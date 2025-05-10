"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientModal } from "./components/patient-modal";
import { FilterModal } from "./components/filter-modal";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PatientEnquiryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState();

  // Mock patient data
  const patients = [
    {
      id: 1,
      uhid: "123456",
      name: "Olivia Rhye",
      age: 28,
      gender: "Male",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Upcoming",
    },
    {
      id: 2,
      uhid: "123456",
      name: "Olivia Rhye",
      age: 28,
      gender: "Male",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Completed",
    },
    {
      id: 3,
      uhid: "123456",
      name: "Olivia Rhye",
      age: 28,
      gender: "Male",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Upcoming",
    },
    {
      id: 4,
      uhid: "123456",
      name: "Olivia Rhye",
      age: 34,
      gender: "Female",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Upcoming",
    },
    {
      id: 5,
      uhid: "123456",
      name: "Olivia Rhye",
      age: 28,
      gender: "Male",
      department: "Orthopedics",
      referralDoctor: "Dr. Hashim",
      appointmentDate: "10 Jan 2025",
      status: "Cancelled",
    },
  ];

  const data = [
    {
      icon: "/assets/images/internationalPatient/totalPatient.svg",
      name: "Total Inpatients Patients",
      value: "200",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/inPatient.svg",
      name: "Inpatient Patients",
      value: "100",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/emergency.svg",
      name: "Emergency Cases",
      value: "120",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "Discharged Patients",
      value: "05",
      link: "",
    },
  ];

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

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center  space-x-2 ">
          <Image
            width={100}
            height={100}
            src={"/assets/images/dashboard/leftArrow.svg"}
            alt="leftArrow"
            className="w-4 h-4"
          />
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium ">Enquiry Patients</p>
        </div>

        <div className="flex flex-col md:flex-row  items-center gap-4 ">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B]"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ListFilter  className="h-4 w-4" />
              Filter
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
          {data.map((data) => (
            <div
              key={data.name}
              className="w-full rounded-[10px] border border-[#D9D9D9] bg-[#F9F9F9] px-2  py-2 flex items-center gap-x-3 "
            >
              <div className="bg-[#FFFFFF] border border-[#D9D9D9]  rounded-[6px] flex items-center justify-center p-1.5">
                <Image
                  src={data?.icon}
                  width={100}
                  height={100}
                  className="w-6 h-6"
                  alt="totalPatient"
                />
              </div>
              <div>
                <p className="text-[#636363] text-sm">{data?.name}</p>
                <p className="text-[#323232] text-[18px] font-bold">
                  {/* {allDashboardData?.totalEnquiries} */}
                  {data?.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Patients Table */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#7F7F7F] font-normal">No.</TableHead>
              <TableHead className="text-[#7F7F7F] font-normal">UHID</TableHead>
              <TableHead className="text-[#7F7F7F] font-normal">Name</TableHead>
              <TableHead className="text-[#7F7F7F] font-normal">Age</TableHead>
              <TableHead className="text-[#7F7F7F] font-normal">
                Gender
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
              <TableHead className="text-[#7F7F7F] font-normal">
                Status
              </TableHead>
              <TableHead className="text-[#7F7F7F] text-center font-normal">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.uhid}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.department}</TableCell>
                <TableCell>{patient.referralDoctor}</TableCell>
                <TableCell>{patient.appointmentDate}</TableCell>
                <TableCell>
                  <span
                    className={`flex items-center gap-1 font-medium ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDot(
                        patient.status
                      )}`}
                    ></span>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/dashboard/patients/${patient.id}`}>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`bg-transparent border-none shadow-none p-0`}
                    >
                      <Eye className="h-4 w-4 text-[#3B8BF4]" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`bg-transparent border-none shadow-none p-0`}
                  >
                    <Pencil className="h-4 w-4 text-[#86C214]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`bg-transparent border-none shadow-none p-0`}
                  >
                    <Trash2 className="h-4 w-4 text-[#FF0037]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isAddModalOpen && (
        <PatientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={setActiveFilters}
        />
      )}
    </>
  );
}
