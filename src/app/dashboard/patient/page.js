"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AllPatients from "./components/all-patients";
import { AddPatientModal } from "./components/add-patient-modal";
import Image from "next/image";

export default function PatientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const statusOptions = [
    { name: "All Status" },
    { name: "In Treatment" },
    { name: "Discharged" },
    { name: "Under Observation" },
    { name: "Scheduled" },
  ];

  const specialityOptions = [
    { name: "All Specialities" },
    { name: "Ortho" },
    { name: "Cardiology" },
    { name: "Neurology" },
    { name: "Oncology" },
    { name: "General Surgery" },
    { name: "Dermatology" },
    { name: "Pediatrics" },
    { name: "Gynecology" },
    { name: "ENT" },
    { name: "Ophthalmology" },
    { name: "Psychiatry" },
    { name: "Radiology" },
    { name: "Anesthesiology" },
    { name: "Emergency Medicine" },
    { name: "Internal Medicine" },
    { name: "Cardiac Science" },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePatientUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Mock stats data - you can replace this with real API data
  const statsData = [
    {
      icon: "/assets/images/internationalPatient/totalPatient.svg",
      name: "Total Patients",
      value: "200",
    },
    {
      icon: "/assets/images/internationalPatient/inPatient.svg",
      name: "In Treatment",
      value: "100",
    },
    {
      icon: "/assets/images/internationalPatient/emergency.svg",
      name: "Emergency Cases",
      value: "120",
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "Discharged Patients",
      value: "05",
    },
  ];

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Patients</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {statsData.map((data) => (
          <div
            key={data.name}
            className="w-full rounded-[10px] border border-[#D9D9D9] bg-[#F9F9F9] px-2 py-2 flex items-center gap-x-3"
          >
            <div className="bg-[#FFFFFF] border border-[#D9D9D9] rounded-[6px] flex items-center justify-center p-1.5">
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
                {data?.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status, index) => (
                <SelectItem
                  key={index}
                  value={status.name.toLowerCase().replace(" ", "-")}
                >
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSpeciality}
            onValueChange={setSelectedSpeciality}
          >
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder="All Specialities" />
            </SelectTrigger>
            <SelectContent>
              {specialityOptions.map((speciality, index) => (
                <SelectItem
                  key={index}
                  value={speciality.name.toLowerCase().replace(" ", "-")}
                >
                  {speciality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[250px]"
            />
          </div>

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
        <AllPatients
          key={refreshKey}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedSpeciality={selectedSpeciality}
          onPatientUpdate={handlePatientUpdate}
        />
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        patient={null}
        onSave={handlePatientUpdate}
      />
    </>
  );
}
