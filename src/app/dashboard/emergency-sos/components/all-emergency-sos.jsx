"use client";

import { useState, useEffect } from "react";
import {
  Ellipsis,
  Eye,
  Loader2,
  Siren,
  MapPin,
  CheckCircle,
  Ban,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import {
  isWithinInterval,
  isSameDay,
  parseISO,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toast } from "sonner";
import TablePagination from "@/app/components/common/Pagination";
import { EmergencySosDetailsModal } from "./emergency-sos-details-modal";
import { UpdateSosStatusModal } from "./update-status-modal";
import { getMockEmergencySos } from "./mock-data";

export default function AllEmergencySos({
  searchQuery = "",
  selectedStatus = "",
  selectedType = "",
  dateRange = null,
  onSosUpdate,
}) {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSos, setSelectedSos] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusSos, setStatusSos] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // null, 'asc', or 'desc'

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch SOS records.
  // TODO: Replace `getMockEmergencySos()` with the real API call once ready,
  // e.g. `await API.emergencySos.getAllEmergencySos(params)`.
  const fetchSos = async () => {
    try {
      setLoading(true);
      const response = await getMockEmergencySos();

      if (response.success === true) {
        setSosList(response.data);
      } else {
        toast.error("Failed to fetch emergency SOS data");
      }
    } catch (error) {
      toast.error("Failed to fetch emergency SOS data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSos();
  }, [selectedStatus, selectedType, dateRange]);

  const handleViewSos = (sos) => {
    setSelectedSos(sos);
    setOpenDropdownId(null);
  };

  const handleUpdateStatus = (sos) => {
    setStatusSos(sos);
    setStatusModalOpen(true);
    setOpenDropdownId(null);
  };

  // Local (mock) status update — swap for an API call when available.
  const handleStatusSaved = (id, newStatus) => {
    setSosList((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    if (onSosUpdate) onSosUpdate();
  };

  const handleDateSort = () => {
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder(null);
    }
  };

  const filteredSos = sosList.filter((sos) => {
    if (!searchQuery && !selectedStatus && !selectedType && !dateRange) {
      return true;
    }

    const matchesSearch = searchQuery
      ? sos.patient_full_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sos.contact_number?.includes(searchQuery) ||
        sos.location_address
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sos.emergency_type?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const statusFilter =
      selectedStatus && selectedStatus !== "all-status"
        ? selectedStatus.replace(/-/g, " ").toLowerCase()
        : "";
    const typeFilter =
      selectedType && selectedType !== "all-types"
        ? selectedType.replace(/-/g, " ").toLowerCase()
        : "";

    const matchesStatus = statusFilter
      ? sos.status?.toLowerCase() === statusFilter
      : true;

    const matchesType = typeFilter
      ? sos.emergency_type?.toLowerCase() === typeFilter
      : true;

    const matchesDateRange = (() => {
      if (!dateRange) return true;
      const sosDate = sos.createdAt;
      if (!sosDate) return false;

      try {
        const parsed =
          typeof sosDate === "string" ? parseISO(sosDate) : new Date(sosDate);

        if (dateRange.from && !dateRange.to) {
          return isSameDay(parsed, dateRange.from);
        }
        if (dateRange.from && dateRange.to) {
          return isWithinInterval(parsed, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
          });
        }
        return true;
      } catch (error) {
        return false;
      }
    })();

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  const sortedSos = [...filteredSos].sort((a, b) => {
    if (sortOrder === null) {
      const createdA = new Date(a.createdAt || 0);
      const createdB = new Date(b.createdAt || 0);
      return createdB - createdA; // Most recent first
    }
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "dispatched":
        return "bg-blue-100 text-blue-800";
      case "en route":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(filteredSos.length / itemsPerPage);

  const paginatedSos = sortedSos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <span className="ml-2 text-gray-600">Loading emergency SOS...</span>
      </div>
    );
  }

  if (sortedSos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No emergency SOS found</div>
        <p className="text-gray-400">
          {searchQuery || selectedStatus || selectedType || dateRange
            ? "Try adjusting your search criteria"
            : "No emergency SOS alerts available yet"}
        </p>
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
              Patient
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Contact
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Emergency Type
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
              Priority
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Location
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Ambulance
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              <button
                onClick={handleDateSort}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Requested At
                {sortOrder === null && <ChevronsUpDown className="h-4 w-4" />}
                {sortOrder === "asc" && <ChevronUp className="h-4 w-4" />}
                {sortOrder === "desc" && <ChevronDown className="h-4 w-4" />}
              </button>
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
              Status
            </TableHead>
            <TableHead className="text-[#7F7F7F] text-center font-normal py-3">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSos.map((sos, index) => {
            const isClosed =
              sos.status?.toLowerCase() === "resolved" ||
              sos.status?.toLowerCase() === "cancelled";
            return (
              <TableRow
                key={sos._id}
                className="hover:bg-red-50 border-b border-gray-100 transition-all duration-200 hover:border-red-200 group"
              >
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">
                      {sos.patient_full_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {sos.gender || "N/A"}
                      {sos.age ? `, ${sos.age} yrs` : ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  {sos.contact_number || "N/A"}
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  <div className="flex items-center gap-1.5">
                    <Siren className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    {sos.emergency_type || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200 text-center">
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(sos.priority)}`}
                  >
                    {sos.priority || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200 max-w-[220px]">
                  <div className="flex items-start gap-1.5 text-sm text-gray-700">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {sos.location_address || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  {sos.assigned_ambulance || (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200">
                  {formatDateTime(sos.createdAt)}
                </TableCell>
                <TableCell className="border-r border-gray-200 py-3 group-hover:border-red-300 transition-colors duration-200 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(sos.status)}`}
                    >
                      {sos.status || "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex justify-center gap-2">
                    <DropdownMenu
                      open={openDropdownId === sos._id}
                      onOpenChange={(open) =>
                        setOpenDropdownId(open ? sos._id : null)
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
                        className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg"
                      >
                        <DropdownMenuItem
                          className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleViewSos(sos)}
                        >
                          <Eye className="h-4 w-4 mr-2 text-gray-500" />
                          View Details
                        </DropdownMenuItem>

                        {isClosed ? (
                          <DropdownMenuItem className="flex items-center px-2 py-2 text-sm text-gray-500 cursor-default">
                            <Ban className="h-4 w-4 mr-2 text-gray-400" />
                            {sos.status}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="flex items-center px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => handleUpdateStatus(sos)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                            Update Status
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Emergency SOS Details Modal */}
      {selectedSos && (
        <EmergencySosDetailsModal
          sos={selectedSos}
          onClose={() => setSelectedSos(null)}
        />
      )}

      {/* Update Status Modal */}
      <UpdateSosStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        sos={statusSos}
        onSave={handleStatusSaved}
      />
    </div>
  );
}
