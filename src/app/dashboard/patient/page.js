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
import Image from "next/image";
import API from "@/api";

export default function PatientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // ── Patient stats ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    total: "-",
    inTreatment: "-",
    discharged: "-",
    underObservation: "-",
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const statusOptions = [
    { name: "All Status" },
    { name: "In Treatment" },
    { name: "Discharged" },
    { name: "Under Observation" },
  ];

  // Fetch departments + stats on mount
  useEffect(() => {
    fetchDepartments();
    fetchStats();
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

  const handlePatientUpdate = () => {
    setRefreshKey((prev) => prev + 1);
    fetchStats(); // refresh stats whenever a patient is updated
  };

  // ── Fetch and derive stats from patients list ──────────────────────────────
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await API.patient.getAllPatients({ page: 1, limit: 1000 });
      // Handle both response shapes: { data: [...] } or { data: { data: [...] } }
      const patients =
        response?.data?.data ??
        (Array.isArray(response?.data) ? response.data : null);

      if (patients) {
        const total = patients.length;
        const inTreatment = patients.filter(
          (p) => p.status?.toLowerCase() === "in treatment"
        ).length;
        const discharged = patients.filter(
          (p) => p.status?.toLowerCase() === "discharged"
        ).length;
        const underObservation = patients.filter(
          (p) => p.status?.toLowerCase() === "under observation"
        ).length;
        setStats({ total, inTreatment, discharged, underObservation });
      }
    } catch (error) {
      console.error("Error fetching patient stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const statsData = [
    {
      icon: "/assets/images/internationalPatient/totalPatient.svg",
      name: "Total Patients",
      value: statsLoading ? "..." : String(stats.total),
    },
    {
      icon: "/assets/images/internationalPatient/inPatient.svg",
      name: "In Treatment",
      value: statsLoading ? "..." : String(stats.inTreatment),
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "Discharged Patients",
      value: statsLoading ? "..." : String(stats.discharged),
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "Patients Under Observation",
      value: statsLoading ? "..." : String(stats.underObservation),
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
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[250px]"
            />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">

          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          {/* <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </Button> */}
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
        <AllPatients
          key={refreshKey}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedSpeciality={selectedSpeciality}
          onPatientUpdate={handlePatientUpdate}
          departments={departments}
          departmentsLoading={departmentsLoading}
        />
      </div>

    </>
  );
}
