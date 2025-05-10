"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  ListFilter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ManageAvailabilityModal } from "./components/manage-availability-modal";
import { DoctorDetailsModal } from "./components/doctor-details-modal";
import { AddDoctorModal } from "./components/add-doctor-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      id: 12345,
      name: "DR MD FARUKUDDIN PURKAIT",
      department: "Cardiologist",
      degree: "DIP CARD, MD,",
      regNo: "Reg No. 65728(WBMC)",
      experience: "30+",
      availability: "Wednesday",
      photoUrl: "/assets/images/doctor/FARUKUDDIN_PURKATTE.webp",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
      isAvailable: true,
    },
    {
      id: 2345,
      name: "DR SUNANDA JANA MBBS",
      department: "Cardiologist",
      degree: "MD, DNB (Cardiology)",
      regNo: "Reg. No. 64394",
      experience: "30+",
      availability: "Wednesday",
      photoUrl: "/assets/images/doctor/SUNANDA_JANA.webp",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Monday", "Wednesday"],
      isAvailable: true,
    },
    {
      id: 3456,
      name: "DR ANIRBAN SAHA MBBS",
      department: "Anesthesiology",
      degree: "MD (Anesthesiology)",
      photoUrl: "/assets/images/doctor/PURNENDU_PAL.webp",
      regNo: "Reg. No. 64306",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Monday", "Tuesday", "Friday"],
      isAvailable: true,
    },
    {
      id: 4567,
      name: "DR BARNAVA PAL MBBS",
      department: "Anesthesiology",
      degree: "DNB (Anesthesiology)",
      photoUrl: "/assets/images/doctor/AMITAVA_SARKAR.webp",
      regNo: "Reg. No. 66083",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Wednesday", "Thursday", "Saturday"],
      isAvailable: true,
    },
    {
      id: 5678,
      name: "DR ARVIND K. MBBS",
      department: "Anesthesiology",
      degree: "DNB (Anesthesiology)",
      regNo: "Reg. No. 133417",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Monday", "Friday"],
      isAvailable: false,
    },
    {
      id: 6789,
      name: "DR RABINDR NATH JANA MBBS",
      department: "Anesthesiology",
      degree: "MD (Anesthesiology)",
      regNo: "Reg. No. 49776",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      isAvailable: true,
    },
    {
      id: 7890,
      name: "DR ARVIND K. MBBS",
      department: "Anesthesiology",
      degree: "DNB (Anesthesiology)",
      regNo: "Reg. No. 133417",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Monday", "Friday"],
      isAvailable: false,
    },
    {
      id: 8901,
      name: "DR RABINDR NATH JANA MBBS",
      department: "Anesthesiology",
      degree: "MD (Anesthesiology)",
      regNo: "Reg. No. 49776",
      experience: "30+",
      availability: "",
      languages: ["English", "Hindi", "Bengali"],
      contactNumber: "+91 6555656585",
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      isAvailable: true,
    },
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.regNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment && selectedDepartment !== "all"
        ? doctor.department === selectedDepartment
        : true;

    return matchesSearch && matchesDepartment;
  });

  const handleSaveDoctor = (data) => {
    console.log("Saving doctor data:", data);
    // Here you would update the doctor data in your state or database
  };

  const handleDeleteDoctor = (doctorId) => {
    console.log("Deleting doctor with ID:", doctorId);
    // Here you would delete the doctor from your state or database
  };

  const handleSaveAvailability = (data  ) => {
    console.log("Saving availability data:", data);
    // Here you would update the doctor's availability in your state or database
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
          <p className="text-[#4B4B4B] font-medium ">Doctors</p>
        </div>

        <div className="flex lex-row justify-between items-center gap-4 ">
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
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                <SelectItem value="Anesthesiology">Anesthesiology</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B]"
            >
              <ListFilter className="h-4 w-4" />
              Filter
            </Button>
            <AddDoctorModal onSave={handleSaveDoctor}>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0">
                <Plus className="h-4 w-4" />
                Add Doctor
              </Button>
            </AddDoctorModal>
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-4">
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border border-[#E2E2E2] cursor-pointer bg-white rounded-[10px] p-0 flex flex-col justify-between overflow-hidden shadow-none transition-shadow"
            >
              <CardContent className="p-0">
                <div className="space-y-4 px-3  py-4 ">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={doctor.isAvailable ? "success" : "secondary"}
                      className={`${
                        doctor.isAvailable
                          ? "bg-[#ECFDF5] text-[#059669]"
                          : "bg-gray-100 text-gray-500"
                      } text-xs px-2 py-1 rounded-full border-none flex items-center gap-2 font-normal`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          doctor.isAvailable ? "bg-[#059669]" : "bg-gray-400"
                        }`}
                      ></div>
                      {doctor.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                    <div className="flex items-center ">
                      <div className="text-[#4B4B4B] bg-[#F5F5F5] rounded-[3px] px-3 py-0.5 text-sm">
                        {doctor.id}
                      </div>

                      {/* DropdownMenu */}
                      <div className=" ">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DoctorDetailsModal
                              doctor={doctor}
                              onEdit={() => setSelectedDoctor(doctor)}
                              onDelete={() => handleDeleteDoctor(doctor.id)}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DoctorDetailsModal>

                            <AddDoctorModal
                              doctor={doctor}
                              onSave={handleSaveDoctor}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Doctor
                              </DropdownMenuItem>
                            </AddDoctorModal>

                            <ManageAvailabilityModal
                              doctor={doctor}
                              onSave={handleSaveAvailability}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Manage Availability
                              </DropdownMenuItem>
                            </ManageAvailabilityModal>

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteDoctor(doctor.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Doctor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="size-12 md:size-14 rounded-full bg-[#C3DDFF] flex items-center justify-center text-blue-600 overflow-hidden">
                      {doctor.photoUrl ? (
                        <Image
                          width={100}
                          height={100}
                          className="w-full h-full object-center object-cover"
                          src={doctor.photoUrl || "/placeholder.svg"}
                          alt={doctor.name}
                        />
                      ) : (
                        <Image
                          width={100}
                          height={100}
                          className="size-8 md:size-9"
                          src="/assets/images/doctor/avatar.svg"
                          alt="avatar"
                        />
                      )}
                    </div>
                    <div>
                      <h3
                        title={doctor.name}
                        className="text-sm text-[#323232] truncate  font-semibold"
                      >
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-[#7F7F7F]">
                        {doctor.degree}, {doctor.regNo}
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex items-center gap-3 justify-start  ">
                    <div className="text-xs flex items-center gap-1 text-[#7F7F7F]">
                      <Image
                        width={100}
                        height={100}
                        className="size-4 md:size-5"
                        src="/assets/images/doctor/calender.svg"
                        alt="avatar"
                      />

                      <div className="flex gap-1 text-[#4B4B4B] text-sm">
                        {doctor.experience}
                        <div className="font-normal">Experience</div>
                      </div>
                    </div>
                    <div className="w-[1.2px] h-[15px] bg-[#7F7F7F]"></div>
                    {doctor.languages && (
                      <div className="text-xs flex items-center gap-1 text-gray-600">
                        <Image
                          width={100}
                          height={100}
                          className="size-4 md:size-5"
                          src="/assets/images/doctor/language.svg"
                          alt="language"
                        />

                        <div className="font-normal text-xs text-[#4B4B4B]">
                          {doctor.languages.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
