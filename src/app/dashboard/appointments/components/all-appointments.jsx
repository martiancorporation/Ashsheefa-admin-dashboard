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
import TablePagination from "@/app/components/common/Pagination";

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
  const itemsPerPage = 20;

  // Fetch appointments from API
  const fetchAppointments = async () => {
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
        search: searchQuery,
        status: statusParam,
        speciality: specialityParam,
      };

      const response = await appointments.getAllAppointmentsWithoutPagination(params);

      if (response.success === true) {
        setAppointmentsList(response.data);
      } else {
        setError("Failed to fetch appointments data");
        toast.error("Failed to fetch appointments data");
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
        setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  // Note: searchQuery is handled client-side only, so it's not in the dependency array
  useEffect(() => {
    setCurrentPage(1);
    fetchAppointments();
  }, [selectedStatus, selectedSpeciality, dateRange]);

  // Handle appointment refresh after add/edit/delete
  const handleAppointmentUpdate = () => {
    if (onAppointmentUpdate) {
      onAppointmentUpdate();
    } else {
      setCurrentPage(1);
      fetchAppointments();
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
    fetchAppointments(); // Refresh the list
    setAppointmentToDelete(null);
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
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
      <Table className="border-collapse border border-gray-200">
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
          {paginatedAppointments.map((appointment, index) => (
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

      <TablePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

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
