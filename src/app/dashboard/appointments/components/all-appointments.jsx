"use client";

import { useState, useEffect } from "react";
import {
  Ellipsis,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  Receipt,
  Phone,
  MapPin,
  User,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { AddAppointmentModal } from "./add-appointment-modal";
import { EditAppointmentModal } from "./edit-appointment-modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { UpdateStatusModal } from "./update-status-modal";
import { toast } from "sonner";
import appointments from "@/api/appointments";
import {
  isWithinInterval,
  isSameDay,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";

export default function AllAppointments({
  searchQuery = "",
  selectedStatus = "",
  selectedSpeciality = "",
  dateRange = null,
  onAppointmentUpdate,
  departments = [],
  departmentsLoading = false,
}) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false);
  const [statusUpdateAppointment, setStatusUpdateAppointment] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', or 'desc'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const appointmentsPerPage = 50;

  // Fetch appointments from API
  const fetchAppointments = async (page = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      // Convert filter values back to original format for API
      const statusParam =
        selectedStatus && selectedStatus !== "all-status"
          ? selectedStatus.replace(/-/g, " ")
          : "";
      const specialityParam =
        selectedSpeciality && selectedSpeciality !== "all-specialities"
          ? selectedSpeciality.replace(/-/g, " ")
          : "";

      const params = {
        page: page,
        limit: appointmentsPerPage,
        search: searchQuery,
        status: statusParam,
        speciality: specialityParam,
      };

      const response = await appointments.getAllAppointments(params);

      // Check if the data is directly in response.data or nested
      let appointmentsData = null;
      let paginationData = null;

      if (response.data && response.data.data) {
        // Direct structure: response.data.data
        appointmentsData = response.data.data;
        paginationData = response.data.pagination;
      } else if (response.data && Array.isArray(response.data)) {
        // Direct array structure
        appointmentsData = response.data;
        paginationData = null;
      }

      if (appointmentsData) {
        console.log(appointmentsData);
        const newAppointments = appointmentsData;
        const totalFromResponse =
          paginationData?.total_records ??
          response.data?.total ??
          response.total ??
          null;

        if (isLoadMore) {
          // Append new appointments to existing list
          setAppointmentsList((prev) => [...prev, ...newAppointments]);
        } else {
          // Replace existing appointments
          setAppointmentsList(newAppointments);
        }

        // Track total only if backend provides it
        setTotalAppointments(totalFromResponse || 0);
        setCurrentPage(page);

        // If total is known, use it. Otherwise, assume more pages exist
        // as long as the current page returned a full page of results
        const calculatedHasMore =
          totalFromResponse != null
            ? page * appointmentsPerPage < totalFromResponse
            : newAppointments.length === appointmentsPerPage;
        setHasMore(calculatedHasMore);
      } else {
        if (!isLoadMore) {
          setAppointmentsList([]);
          setTotalAppointments(0);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      if (!isLoadMore) {
        toast.error("Failed to fetch appointments");
        setAppointmentsList([]);
        setTotalAppointments(0);
      } else {
        toast.error("Failed to load more appointments");
      }
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Fetch data on component mount and when filters change
  // Note: searchQuery is handled client-side only, so it's not in the dependency array
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchAppointments(1, false);
  }, [selectedStatus, selectedSpeciality, dateRange]);

  // Handle appointment refresh after add/edit/delete
  const handleAppointmentUpdate = () => {
    if (onAppointmentUpdate) {
      onAppointmentUpdate();
    } else {
      setCurrentPage(1);
      setHasMore(true);
      fetchAppointments(1, false);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDropdownId(null); // Close dropdown when view details is clicked
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setEditModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when edit is clicked
  };

  const handleUpdateStatus = (appointment) => {
    setStatusUpdateAppointment(appointment);
    setStatusUpdateModalOpen(true);
    setOpenDropdownId(null); // Close dropdown when update status is clicked
  };

  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setOpenDropdownId(null); // Close dropdown when delete is clicked
  };

  const handleDeleteSuccess = () => {
    setCurrentPage(1);
    setHasMore(true);
    fetchAppointments(1, false); // Refresh the list
    setAppointmentToDelete(null);
  };

  // ****************************** Load More Function ***********************************
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchAppointments(currentPage + 1, true);
    }
  };

  // Handle date sort toggle
  const handleDateSort = () => {
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder(null);
    }
  };

  // Filter appointments based on search and filters
  const filteredAppointments = appointmentsList.filter((appointment) => {
    // Show all appointments if no filters are applied
    if (!searchQuery && !selectedStatus && !selectedSpeciality && !dateRange) {
      return true;
    }

    const matchesSearch = searchQuery
      ? appointment.patientId?.patient_full_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.patientId?.contact_number?.includes(searchQuery) ||
        appointment.doctorId?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.doctorId?.department
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // Convert filter values back to original format for comparison
    const statusFilter = selectedStatus
      ? selectedStatus.replace(/-/g, " ").toLowerCase()
      : "";
    const specialityFilter = selectedSpeciality
      ? selectedSpeciality.replace(/-/g, " ").toLowerCase()
      : "";

    // Also try exact match with original dropdown values
    const statusExact = selectedStatus ? selectedStatus : "";
    const specialityExact = selectedSpeciality ? selectedSpeciality : "";

    // Handle "All" options - they should match everything
    const matchesStatus =
      selectedStatus && selectedStatus !== "all-status"
        ? appointment.status?.toLowerCase() === statusFilter ||
          appointment.status?.toLowerCase().includes(statusFilter) ||
          statusFilter.includes(appointment.status?.toLowerCase()) ||
          appointment.status?.toLowerCase() === statusExact ||
          appointment.status?.toLowerCase() === statusExact.replace(/-/g, " ")
        : true;

    const matchesSpeciality =
      selectedSpeciality && selectedSpeciality !== "all-specialities"
        ? appointment.speciality?.toLowerCase() === specialityFilter ||
          appointment.speciality?.toLowerCase().includes(specialityFilter) ||
          specialityFilter.includes(appointment.speciality?.toLowerCase()) ||
          appointment.speciality?.toLowerCase() === specialityExact ||
          appointment.speciality?.toLowerCase() ===
            specialityExact.replace(/-/g, " ")
        : true;

    const matchesDateRange = (() => {
      if (!dateRange) return true;

      // Parse appointment date
      const appointmentDate = appointment.appointment_date || appointment.date;
      if (!appointmentDate) return false;

      try {
        // Try to parse the date (handles various formats)
        let parsedAppointmentDate;
        if (typeof appointmentDate === "string") {
          parsedAppointmentDate = parseISO(appointmentDate);
        } else {
          parsedAppointmentDate = new Date(appointmentDate);
        }

        // If only from date is selected (single date)
        if (dateRange.from && !dateRange.to) {
          return isSameDay(parsedAppointmentDate, dateRange.from);
        }

        // If both from and to dates are selected (date range)
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(parsedAppointmentDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
          });
        }

        return true;
      } catch (error) {
        console.error("Error parsing appointment date:", error);
        return false;
      }
    })();

    const shouldInclude =
      matchesSearch && matchesStatus && matchesSpeciality && matchesDateRange;

    return shouldInclude;
  });

  // Sort filtered appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortOrder === null) {
      // Sort by createdAt (most recent first)
      const createdA = new Date(a.createdAt || a.created_at || 0);
      const createdB = new Date(b.createdAt || b.created_at || 0);
      return createdB - createdA; // Most recent at top
    }

    const dateA = new Date(a.appointment_date || a.date);
    const dateB = new Date(b.appointment_date || b.date);

    if (sortOrder === "asc") {
      return dateA - dateB; // Ascending
    } else {
      return dateB - dateA; // Descending
    }
  });

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  if (sortedAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {loading ? "Loading..." : "No appointments found"}
        </div>
        {!loading && (
          <p className="text-gray-400">
            {searchQuery || selectedStatus || selectedSpeciality
              ? "Try adjusting your search criteria"
              : "No appointments available yet"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table className="border-collapse border border-gray-200 ">
        <TableHeader>
          <TableRow className="bg-gray-50 border border-gray-200">
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              No.
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Name
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Gender
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Contact
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Department
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Doctor
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              <button
                onClick={handleDateSort}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Appointment Date/Time
                {sortOrder === null && <ChevronsUpDown className="h-4 w-4" />}
                {sortOrder === "asc" && <ChevronUp className="h-4 w-4" />}
                {sortOrder === "desc" && <ChevronDown className="h-4 w-4" />}
              </button>
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Fees
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
              Appointment Status
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
              Payment Status
            </TableHead>
            <TableHead className="text-[#7F7F7F] text-center font-normal py-3">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment, index) => (
            <TableRow
              key={appointment._id}
              className="hover:bg-blue-50 border-b border-gray-100 transition-all duration-200 hover:border-blue-200 group"
            >
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {index + 1}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {appointment.patientId?.patient_full_name || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {appointment.patientId?.gender || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {appointment.patientId?.contact_number || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {appointment.doctorId?.department || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                {appointment.doctorId?.fullName || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">
                    {formatDate(appointment.appointment_date)}
                  </div>
                  {appointment.slot_start_time && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatTime(appointment.slot_start_time)}
                      {appointment.slot_end_time &&
                        ` – ${formatTime(appointment.slot_end_time)}`}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                {appointment.amount || appointment.doctorId?.fees || "N/A"}
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(appointment.status)}`}
                  >
                    {appointment.status || "N/A"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(
                      appointment.paymentStatus,
                    )}`}
                  >
                    {appointment.paymentStatus || "N/A"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex justify-center gap-2">
                  <DropdownMenu
                    open={openDropdownId === appointment._id}
                    onOpenChange={(open) =>
                      setOpenDropdownId(open ? appointment._id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100 cursor-pointer"
                      >
                        <Ellipsis className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <DropdownMenuItem
                        className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Eye className="h-4 w-4 mr-2 text-gray-500" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                        Edit Appointment
                      </DropdownMenuItem>

                      {appointment.paymentStatus === "paid" ? (
                        <DropdownMenuItem
                          className="flex items-center px-2 py-2 text-sm text-green-700 hover:bg-green-50 cursor-pointer transition-colors"
                          onClick={() => handleUpdateStatus(appointment)}
                        >
                          <Receipt className="h-4 w-4 mr-2 text-green-600" />
                          Payment Details
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="flex items-center px-2 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer transition-colors"
                          onClick={() => handleUpdateStatus(appointment)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        onClick={() => handleDeleteAppointment(appointment)}
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Delete Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center space-y-1 mt-6">
          {totalAppointments > 0 ? (
            <div className="text-sm text-gray-600">
              Showing {appointmentsList.length} of {totalAppointments}{" "}
              appointments
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Showing {appointmentsList.length} appointments
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
              "Load More Appointments"
            )}
          </Button>
        </div>
      )}

      {/* Show total count when all appointments are loaded */}
      {!hasMore && appointmentsList.length > 0 && (
        <div className="flex justify-center mt-6">
          {totalAppointments > 0 ? (
            <div className="text-sm text-gray-600">
              Showing all {totalAppointments} appointments
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Showing all {appointmentsList.length} appointments
            </div>
          )}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={handleAppointmentUpdate}
        />
      )}

      {/* Edit Appointment Modal */}
      <EditAppointmentModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        appointment={editingAppointment}
        onSave={handleAppointmentUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        appointment={appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        open={statusUpdateModalOpen}
        onOpenChange={setStatusUpdateModalOpen}
        appointment={statusUpdateAppointment}
        onSave={handleAppointmentUpdate}
      />
    </div>
  );
}
