"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Phone, ListFilter, Loader2 } from "lucide-react";
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
import API from "@/api";
import { toast } from "sonner";
import useAuthDataStore from "@/store/authStore";

export default function PatientEnquiryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState();
  const [loading, setLoading] = useState(false);
  const [patientsEnquiry, setPatientsEnquiry] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState(null);

  const authData = useAuthDataStore((state) => state.authData);

  // Fetch patients enquiry data on component mount
  useEffect(() => {
    getAllPatientsEnquiry();
  }, []);

  // Filter patients based on search query and active filters
  useEffect(() => {
    console.log("Filtering patients enquiry:", {
      totalPatients: patientsEnquiry.length,
      searchQuery,
      activeFilters,
      patientsEnquiry,
    });

    let filtered = patientsEnquiry;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone_number?.includes(searchQuery)
      );
    }

    // Apply active filters
    if (activeFilters) {
      if (activeFilters.department) {
        filtered = filtered.filter(
          (patient) => patient.department === activeFilters.department
        );
      }
      if (activeFilters.gender) {
        filtered = filtered.filter(
          (patient) => patient.gender === activeFilters.gender
        );
      }
    }

    console.log("Filtered patients enquiry:", {
      filteredCount: filtered.length,
      filteredPatients: filtered,
    });

    setFilteredPatients(filtered);
  }, [searchQuery, patientsEnquiry, activeFilters]);

  // Get all patients enquiry data
  const getAllPatientsEnquiry = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.patientsEnquiry.getAllPatientsEnquiry(1);

      if (response.success === true) {
        console.log("Full API response:", response);
        console.log("Patients enquiry data:", response.data);
        console.log("Data length:", response.data?.length);
        setPatientsEnquiry(response.data);
        setFilteredPatients(response.data);
        console.log("Patients enquiry loaded:", response.data);
      } else {
        setError("Failed to fetch patients enquiry data");
        toast.error("Failed to fetch patients enquiry data");
      }
    } catch (error) {
      console.error("Error fetching patients enquiry:", error);
      setError("Error fetching patients enquiry data");
      toast.error("Error fetching patients enquiry data");
    } finally {
      setLoading(false);
    }
  };

  // Handle call action
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, "_self");
    } else {
      toast.error("Phone number not available");
    }
  };

  // Handle filter application
  const handleApplyFilters = (filters) => {
    // Convert "all" values to empty strings for filtering logic
    const processedFilters = {
      department: filters.department === "all" ? "" : filters.department,
      gender: filters.gender === "all" ? "" : filters.gender,
    };
    setActiveFilters(processedFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  // Check if any filters are active
  const hasActiveFilters =
    activeFilters && Object.values(activeFilters).some((value) => value !== "");

  const data = [
    {
      icon: "/assets/images/internationalPatient/totalPatient.svg",
      name: "Total Enquiries",
      value: patientsEnquiry.length || "0",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/inPatient.svg",
      name: "Today's Enquiries",
      value: "0",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/emergency.svg",
      name: "This Week",
      value: "0",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "This Month",
      value: "0",
      link: "",
    },
  ];

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

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
              disabled={loading}
            />
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-[#4B4B4B] cursor-pointer"
            disabled={loading}
            onClick={getAllPatientsEnquiry}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-[#4B4B4B]"
            onClick={() => setIsFilterModalOpen(true)}
            disabled={loading}
          >
            <ListFilter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0 cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            New Enquiry
          </Button>
        </div>
      </div>

      <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        {data.map((data) => (
          <div
            key={data.name}
            className="w-full rounded-[10px] border border-[#D9D9D9] bg-[#F9F9F9] px-2  py-1 flex items-center gap-x-3 "
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
                {data?.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Patients Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-700">
                Loading patients enquiry...
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Please wait while we fetch the latest data
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={getAllPatientsEnquiry}
              variant="outline"
              className="cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No patients enquiry found</p>
            {(searchQuery || hasActiveFilters) && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                className="cursor-pointer"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">
                    Active Filters:
                  </span>
                  {activeFilters.department && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Department: {activeFilters.department}
                    </span>
                  )}
                  {activeFilters.gender && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Gender: {activeFilters.gender}
                    </span>
                  )}
                </div>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-xs cursor-pointer"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          <Table className="w-full border border-gray-300 rounded-md ">
            <TableHeader className="bg-[#F9F9F9] rounded-md border border-gray-300">
              <TableRow>
                <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-300">
                  No.
                </TableHead>
                <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-300">
                  Full Name
                </TableHead>
                <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-300">
                  Phone Number
                </TableHead>
                <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-300">
                  Created Date
                </TableHead>
                <TableHead className="text-[#7F7F7F] text-center font-normal border-r border-gray-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow key={patient._id}>
                  <TableCell className="border-r border-gray-300">{index + 1}</TableCell>
                  <TableCell className="border-r border-gray-300">{patient.name}</TableCell>
                  <TableCell className="border-r border-gray-300">{patient.phone_number}</TableCell>
                  <TableCell className="border-r border-gray-300">
                    {patient.created_at
                      ? new Date(patient.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center border-r border-gray-300">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-transparent border-none shadow-none p-0 cursor-pointer hover:bg-blue-50 rounded-full"
                      onClick={() => handleCall(patient.phone_number)}
                      title="Call"
                    >
                      <Phone className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {isAddModalOpen && (
        <PatientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={getAllPatientsEnquiry}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          onClear={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
          patients={patientsEnquiry}
        />
      )}
    </>
  );
}
