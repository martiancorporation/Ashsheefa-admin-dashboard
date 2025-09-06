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
import AllAppointments from "./components/all-appointments";
import { AddAppointmentModal } from "./components/add-appointment-modal";
import API from "@/api";

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Dynamic departments state
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const statusOptions = [
    { name: "All Status" },
    { name: "Pending" },
    { name: "In Progress" },
    { name: "Cancelled" },
    { name: "Confirmed" },
  ];

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // ************** FETCH DEPARTMENTS API CALL *******************
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await API.department.getAllDepartments(1, 100); // Get all departments

      if (response && response.departments) {
        const departmentNames = response.departments
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
        setDepartments(departmentNames);
      } else if (response && response.data) {
        const departmentNames = response.data
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
        setDepartments(departmentNames);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Fallback to static list if API fails
      setDepartments([
        "Ortho",
        "Cardiology",
        "Neurology",
        "Oncology",
        "General Surgery",
        "Dermatology",
        "Pediatrics",
        "Gynecology",
        "ENT",
        "Ophthalmology",
        "Psychiatry",
        "Radiology",
        "Anesthesiology",
        "Emergency Medicine",
        "Internal Medicine",
        "Cardiac Science",
      ]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const specialityOptions = [
    { name: "All Specialities" },
    ...departments.map((dept) => ({ name: dept })),
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleAppointmentUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Appointments</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[150px]">
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
            disabled={departmentsLoading}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue
                placeholder={
                  departmentsLoading ? "Loading..." : "All Specialities"
                }
              />
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
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[300px]"
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
            Add Appointment
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
        <AllAppointments
          key={refreshKey}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedSpeciality={selectedSpeciality}
          onAppointmentUpdate={handleAppointmentUpdate}
          departments={departments}
          departmentsLoading={departmentsLoading}
        />
      </div>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        appointment={null}
        onSave={handleAppointmentUpdate}
        departments={departments}
        departmentsLoading={departmentsLoading}
      />
    </>
  );
}
