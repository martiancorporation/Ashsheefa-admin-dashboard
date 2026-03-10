"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  ArrowRight,
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
import { DoctorDetailsModal } from "./components/doctor-details-modal";
import { AddDoctorModal } from "./components/add-doctor-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import API from "@/api";
import { toast } from "sonner";
import useAuthDataStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function DoctorsPage() {
  const router = useRouter();
  // Dynamic departments will be fetched from API
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [activeDoctorsCount, setActiveDoctorsCount] = useState(null);
  const [inactiveDoctorsCount, setInactiveDoctorsCount] = useState(null);
  const doctorsPerPage = 15;

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addDoctorModalOpen, setAddDoctorModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [doctorForAction, setDoctorForAction] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const authData = useAuthDataStore((state) => state.authData);

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
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Fetch all doctors and departments on component mount
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    getAllDoctors(1, false);
    fetchDepartments();
  }, []);

  // Monitor modal states and ensure proper cleanup
  useEffect(() => {
    const allModalsClosed =
      !detailsModalOpen &&
      !editModalOpen &&
      !addDoctorModalOpen &&
      !deleteConfirmationOpen;
    if (allModalsClosed && doctorForAction) {
      setDoctorForAction(null);
    }
  }, [
    detailsModalOpen,
    editModalOpen,
    addDoctorModalOpen,
    deleteConfirmationOpen,
    doctorForAction,
  ]);

  // Close dropdown when any modal opens
  useEffect(() => {
    if (
      detailsModalOpen ||
      editModalOpen ||
      addDoctorModalOpen ||
      deleteConfirmationOpen
    ) {
      setOpenDropdownId(null);
    }
  }, [
    detailsModalOpen,
    editModalOpen,
    addDoctorModalOpen,
    deleteConfirmationOpen,
  ]);

  // ************** GET ALL DOCTORS API CALL *******************
  const getAllDoctors = (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    console.log("Fetching doctors...", { page, isLoadMore });
    API.doctor
      .getAllDoctors(page, doctorsPerPage)
      .then((response) => {
        console.log("API Response:", response);
        if (response.success === true) {
          setDoctor(response);
          const newDoctors =
            response.data?.doctors ||
            response.data?.data ||
            (Array.isArray(response.data) ? response.data : []) ||
            [];
          const totalFromResponse =
            response.data?.counts?.totalDoctors ??
            response.data?.totalRecords ??
            response.data?.total ??
            response.total ??
            null;
          const activeFromResponse =
            response.data?.counts?.activeDoctors ?? null;
          const inactiveFromResponse =
            response.data?.counts?.inactiveDoctors ?? null;

          if (isLoadMore) {
            // Append new doctors to existing list
            setAllDoctors((prev) => [...prev, ...newDoctors]);
            setFilteredDoctors((prev) => [...prev, ...newDoctors]);
          } else {
            // Replace existing doctors
            setAllDoctors(newDoctors);
            setFilteredDoctors(newDoctors);
          }

          // Track total only if backend provides it; otherwise leave null
          setTotalDoctors(totalFromResponse);
          setActiveDoctorsCount(activeFromResponse);
          setInactiveDoctorsCount(inactiveFromResponse);
          setCurrentPage(page);
          setError(null);
          // If total is known, use it. Otherwise, assume more pages exist
          // as long as the current page returned a full page of results
          const calculatedHasMore =
            totalFromResponse != null
              ? page * doctorsPerPage < totalFromResponse
              : newDoctors.length === doctorsPerPage;
          setHasMore(calculatedHasMore);

          console.log("Doctors loaded:", {
            newDoctors,
            total: totalFromResponse,
            currentPage: page,
            hasMore: calculatedHasMore,
          });
        } else {
          if (!isLoadMore) {
            setError("Failed to fetch doctors");
            toast.error("Failed to fetch doctors");
          } else {
            toast.error("Failed to load more doctors");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
        if (!isLoadMore) {
          setError("Error fetching doctors");
          setAllDoctors([]);
          setFilteredDoctors([]);
          setActiveDoctorsCount(null);
          setInactiveDoctorsCount(null);
        }
        toast.error("Error fetching doctors");
      })
      .finally(() => {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      });
  };

  // ****************************** Refresh Function ***********************************
  const funcRefresh = () => {
    setCurrentPage(1);
    setHasMore(true);
    getAllDoctors(1, false);
  };

  // ****************************** Load More Function ***********************************
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      getAllDoctors(currentPage + 1, true);
    }
  };

  // ****************************** Search Function ***********************************
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Reset pagination when searching
    if (value !== searchTerm) {
      setCurrentPage(1);
      setHasMore(true);
    }

    // Filter doctors based on search term matching doctorId, fullName, department, or regNo
    const filtered = allDoctors.filter(
      (doctor) =>
        doctor.doctorId
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        doctor.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        doctor.department?.toLowerCase().includes(value.toLowerCase()) ||
        doctor.regNo?.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  };

  // ****************************** Department Filter Function ***********************************
  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);

    // Reset pagination when filtering by department
    setCurrentPage(1);
    setHasMore(true);

    if (department === "all") {
      setFilteredDoctors(allDoctors);
    } else {
      const filtered = allDoctors.filter(
        (doctor) => doctor.department === department,
      );
      setFilteredDoctors(filtered);
    }
  };

  // ****************************** Dropdown Action Handlers ***********************************
  const handleViewDetails = (doctor) => {
    console.log("Opening details modal for:", doctor);
    setOpenDropdownId(null); // Close dropdown
    setDoctorForAction(doctor);
    setDetailsModalOpen(true);
  };

  const handleEditDoctor = async (doctor) => {
    console.log("Opening edit modal for:", doctor);
    setOpenDropdownId(null); // Close dropdown
    try {
      const response = await API.doctor.getDoctorById(doctor._id);
      const fullDoctor =
        response?.data?.doctor ||
        response?.data ||
        (Array.isArray(response) ? response[0] : null) ||
        response;
      if (fullDoctor && fullDoctor._id) {
        setDoctorForAction(fullDoctor);
      } else {
        // Fallback to existing item if API shape is unexpected
        setDoctorForAction(doctor);
      }
    } catch (e) {
      console.error("Failed to fetch full doctor details:", e);
      setDoctorForAction(doctor);
    } finally {
      setEditModalOpen(true);
    }
  };

  const handleDeleteDoctor = (doctor) => {
    console.log("Opening delete confirmation for:", doctor);
    setOpenDropdownId(null); // Close dropdown
    setDoctorForAction(doctor);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorForAction) return;

    try {
      const response = await API.doctor.deleteDoctor(
        doctorForAction._id,
        authData?.access_token,
      );

      if (response && response.success !== false) {
        toast.success("Doctor deleted successfully");
        // Optimistically update local lists and counts
        setAllDoctors((prev) =>
          prev.filter((d) => d._id !== doctorForAction._id),
        );
        setFilteredDoctors((prev) =>
          prev.filter((d) => d._id !== doctorForAction._id),
        );
        setTotalDoctors((prev) =>
          prev != null ? Math.max(prev - 1, 0) : prev,
        );
        if (doctorForAction.isActive) {
          setActiveDoctorsCount((prev) =>
            prev != null ? Math.max(prev - 1, 0) : prev,
          );
        } else {
          setInactiveDoctorsCount((prev) =>
            prev != null ? Math.max(prev - 1, 0) : prev,
          );
        }
        setDeleteConfirmationOpen(false);
        setDoctorForAction(null);
      } else {
        toast.error("Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Error deleting doctor");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setDoctorForAction(null);
  };

  // Handle modal state changes
  const handleDetailsModalChange = (open) => {
    // setDetailsModalOpen(open);
    // if (!open) setDoctorForAction(null);
    setOpenDropdownId(null);
    router.push(`/dashboard/doctors/${doctor._id}`);
  };

  const handleEditModalChange = (open) => {
    setEditModalOpen(open);
    if (!open) setDoctorForAction(null);
  };

  const handleAddDoctorModalChange = (open) => {
    setAddDoctorModalOpen(open);
    if (!open) setDoctorForAction(null);
  };

  const handleToggleDoctorStatus = async (doctor) => {
    try {
      setOpenDropdownId(null); // Close dropdown
      const updatedDoctor = {
        ...doctor,
        isActive: !doctor.isActive,
      };

      const response = await API.doctor.updateDoctor(
        updatedDoctor,
        authData?.access_token,
      );

      if (response && response !== false) {
        const status = updatedDoctor.isActive ? "activated" : "deactivated";
        toast.success(`Doctor ${status} successfully`);
        // Optimistically update local lists
        setAllDoctors((prev) =>
          prev.map((d) => (d._id === updatedDoctor._id ? updatedDoctor : d)),
        );
        setFilteredDoctors((prev) =>
          prev.map((d) => (d._id === updatedDoctor._id ? updatedDoctor : d)),
        );
        // Update counts if we have them from backend
        setActiveDoctorsCount((prev) => {
          if (prev == null) return prev;
          return updatedDoctor.isActive ? prev + 1 : Math.max(prev - 1, 0);
        });
        setInactiveDoctorsCount((prev) => {
          if (prev == null) return prev;
          return updatedDoctor.isActive ? Math.max(prev - 1, 0) : prev + 1;
        });
      } else {
        toast.error(
          `Failed to ${
            updatedDoctor.isActive ? "activate" : "deactivate"
          } doctor`,
        );
      }
    } catch (error) {
      console.error("Error toggling doctor status:", error);
      toast.error("Error updating doctor status");
    }
  };

  const handleSaveDoctor = async (data) => {
    try {
      if (editModalOpen) {
        // Update existing doctor
        const response = await API.doctor.updateDoctor(
          data,
          authData?.access_token,
        );
        console.log("Update doctor response:", response);
        console.log("Response type:", typeof response);
        console.log(
          "Response keys:",
          response ? Object.keys(response) : "No response",
        );

        // Check for success - response could be an object, array, or have success property
        const isSuccess =
          response &&
          (response.success === true ||
            response.status === 200 ||
            Array.isArray(response) ||
            (typeof response === "object" &&
              response !== null &&
              !response.error));

        if (isSuccess) {
          toast.success("Doctor updated successfully");
          funcRefresh(); // Refresh the list
          setEditModalOpen(false);
        } else {
          toast.error("Failed to update doctor");
        }
      } else {
        // Add new doctor
        const response = await API.doctor.addDoctor(
          data,
          authData?.access_token,
        );
        console.log("Add doctor response:", response);
        console.log("Response type:", typeof response);
        console.log(
          "Response keys:",
          response ? Object.keys(response) : "No response",
        );
        console.log("Response === false:", response === false);
        console.log("Response truthy check:", !!response);

        // Check for success - response could be an object, array, or have success property
        const isSuccess =
          response &&
          (response.success === true ||
            response.status === 200 ||
            Array.isArray(response) ||
            (typeof response === "object" &&
              response !== null &&
              !response.error) ||
            response._id); // If response has an _id, it's likely successful

        if (isSuccess) {
          toast.success("Doctor added successfully");
          funcRefresh(); // Refresh the list
          setAddDoctorModalOpen(false); // Close the add doctor modal
        } else {
          toast.error("Failed to add doctor");
        }
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("Error saving doctor");
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
          <p className="text-[#4B4B4B] font-medium ">Doctors</p>
        </div>

        <div className="flex lex-row justify-between items-center gap-4 ">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select
              value={selectedDepartment}
              onValueChange={handleDepartmentFilter}
              disabled={loading || departmentsLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    departmentsLoading ? "Loading..." : "Select Department"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B] cursor-pointer"
              disabled={loading}
              onClick={funcRefresh}
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
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0 cursor-pointer"
              disabled={loading}
              onClick={() => setAddDoctorModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </div>
        </div>
      </div>

      {/* Stats: Total, Active, Inactive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-0">
        {(() => {
          const totalCount = doctor?.counts?.totalDoctors;
          const activeCount = doctor?.counts?.activeDoctors;
          const inactiveCount = doctor?.counts?.inactiveDoctors;
          return (
            <>
              <Card className="border border-[#E2E2E2] bg-white rounded-[10px] p-0 shadow-none">
                <CardContent className="py-2 px-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#7F7F7F]">Total Doctors</p>
                    <p className="text-xl font-semibold text-[#323232]">
                      {totalCount}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 2a5 5 0 015 5v1a5 5 0 11-10 0V7a5 5 0 015-5zm7 18a1 1 0 01-1 1H6a1 1 0 01-1-1 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[#E2E2E2] bg-white rounded-[10px] p-0 shadow-none">
                <CardContent className="py-2 px-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#7F7F7F]">Active Doctors</p>
                    <p className="text-xl font-semibold text-[#059669]">
                      {activeCount}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M9 12l2 2 4-4 1.5 1.5L11 16l-3.5-3.5L9 12z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[#E2E2E2] bg-white rounded-[10px] p-0 shadow-none">
                <CardContent className="py-2 px-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#7F7F7F]">Inactive Doctors</p>
                    <p className="text-xl font-semibold text-[#B91C1C]">
                      {inactiveCount}
                    </p>
                  </div>
                  <div className="size-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M6.225 4.811L4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </>
          );
        })()}
      </div>

      <div className="h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll pt-2">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="text-lg font-medium text-gray-700">
                  Loading doctors...
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Please wait while we fetch the latest data
              </p>
            </div>
          </div>
        ) : error && allDoctors.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={funcRefresh}
                variant="outline"
                className="cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No doctors found</p>
              {searchTerm || selectedDepartment !== "" ? (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("");
                    setFilteredDoctors(allDoctors);
                    setCurrentPage(1);
                    setHasMore(true);
                  }}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-4">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="border border-[#E2E2E2] cursor-pointer bg-white rounded-[10px] p-0 flex flex-col justify-between overflow-hidden shadow-none transition-shadow"
              >
                <CardContent className="p-0">
                  <Link href={`/dashboard/doctors/${doctor._id}`}>
                    <div className="space-y-2 px-3 py-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={doctor.isActive ? "success" : "secondary"}
                          className={`${
                            doctor.isActive
                              ? "bg-[#ECFDF5] text-[#059669]"
                              : "bg-gray-100 text-gray-500"
                          } text-xs px-2 py-1 rounded-full border-none flex items-center gap-2 font-normal`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              doctor.isActive ? "bg-[#059669]" : "bg-gray-400"
                            }`}
                          ></div>
                          {doctor.isActive ? "Available" : "Not Available"}
                        </Badge>
                        <div className="flex items-center ">
                          <div className="text-[#4B4B4B] bg-[#F5F5F5] rounded-[3px] px-3 py-0.5 text-sm">
                            {doctor.doctorId}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start space-y-2">
                        <div className="size-12 md:size-14 rounded-full bg-[#C3DDFF] flex items-center justify-center text-blue-600 overflow-hidden shrink-0">
                          {doctor.profilePic ? (
                            <Image
                              width={100}
                              height={100}
                              className="w-full h-full object-top object-cover"
                              src={doctor.profilePic || "/placeholder.svg"}
                              alt={doctor.fullName}
                            />
                          ) : (
                            <Image
                              width={100}
                              height={100}
                              className="size-8 md:size-9 "
                              src="/assets/images/doctor/avatar.svg"
                              alt="avatar"
                            />
                          )}
                        </div>
                        <div className="flex justify-between items-end w-full">
                        <div>
                          <h3
                            title={doctor.fullName}
                            className="text-sm text-[#323232] truncate uppercase font-semibold"
                          >
                            {doctor.fullName}
                          </h3>
                          <p className="text-xs text-[#7F7F7F]">
                            {doctor.qualification}, {doctor.regNo}
                          </p>
                        </div>
                        <div className="flex text-xs underline text-[#4B4B4B] group hover:text-blue-700 items-center">
                          View details
                         <ArrowRight className="h-3 w-3" />
                        </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center space-y-1">
          {totalDoctors != null ? (
            <div className="text-sm text-gray-600">
              Showing {allDoctors.length} of {totalDoctors} doctors
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Showing {allDoctors.length} doctors
            </div>
          )}
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            className="flex items-center gap-2 px-6 py-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Load More Doctors
              </>
            )}
          </Button>
        </div>
      )}

      {/* Show total count when all doctors are loaded */}
      {!hasMore && allDoctors.length > 0 && (
        <div className="flex justify-center ">
          {totalDoctors != null ? (
            <div className="text-sm text-gray-600">
              Showing all {totalDoctors} doctors
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Showing all {allDoctors.length} doctors
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {doctorForAction && (
        <>
          <DoctorDetailsModal
            open={detailsModalOpen}
            onOpenChange={handleDetailsModalChange}
            doctor={doctorForAction}
          />

          <AddDoctorModal
            open={editModalOpen}
            onOpenChange={handleEditModalChange}
            doctor={doctorForAction}
            onSave={handleSaveDoctor}
            departments={departments}
            departmentsLoading={departmentsLoading}
          />
        </>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal
        open={addDoctorModalOpen}
        onOpenChange={handleAddDoctorModalChange}
        onSave={handleSaveDoctor}
        departments={departments}
        departmentsLoading={departmentsLoading}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={deleteConfirmationOpen}
        onOpenChange={setDeleteConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{doctorForAction?.fullName}</span>{" "}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
