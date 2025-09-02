"use client";

import { useState } from "react";
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
import AllInternationalPatients from "./components/all-international-patients";
import { AddInternationalPatientModal } from "./components/add-international-patient-modal";

export default function InternationalPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all-status");
  const [selectedSpeciality, setSelectedSpeciality] =
    useState("all-specialities");
  const [selectedCountry, setSelectedCountry] = useState("all-countries");
  const [refreshKey, setRefreshKey] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const statusOptions = [
    { name: "All Status" },
    { name: "Pending" },
    { name: "In Progress" },
    { name: "Cancelled" },
    { name: "Confirmed" },
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
  ];

  const countryOptions = [
    { name: "All Countries" },
    { name: "Nepal" },
    { name: "Bhutan" },
    { name: "Bangladesh" },
    { name: "China" },
    { name: "Pakistan" },
    { name: "Afghanistan" },
    { name: "Sri Lanka" },
    { name: "South Africa" },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePatientUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Debug logging for filter changes
  console.log("Current filter states:", {
    selectedStatus,
    selectedSpeciality,
    selectedCountry,
    searchQuery,
  });

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">International Patients</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex  items-center gap-2">
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
            <SelectTrigger className="w-full md:w-[150px]">
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

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full md:w-[130px]">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country, index) => (
                <SelectItem
                  key={index}
                  value={country.name.toLowerCase().replace(" ", "-")}
                >
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[200px]"
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
        <AllInternationalPatients
          key={refreshKey}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedSpeciality={selectedSpeciality}
          selectedCountry={selectedCountry}
          onPatientUpdate={handlePatientUpdate}
        />
      </div>

      {/* Add International Patient Modal */}
      <AddInternationalPatientModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        patient={null}
        onSave={handlePatientUpdate}
      />
    </>
  );
}
