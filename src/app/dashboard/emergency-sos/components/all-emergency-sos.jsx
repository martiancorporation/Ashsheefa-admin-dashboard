"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Loader2,
  MapPin,
  Phone,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Check,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import API from "@/api";
import { cn } from "@/lib/utils";
import useSosStore from "@/store/sosStore";

// Derive age (years) from a date_of_birth string.
const calcAge = (dob) => {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 150 ? age : null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeAddress = (value) => {
  if (!value) return null;

  if (typeof value === "object") {
    const parts = [
      value.street,
      value.city,
      value.state,
      value.pincode,
      value.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  }

  const text = String(value).trim();
  if (!text) return null;
  if (EMAIL_RE.test(text)) return null; // an email is not a location
  if (/^\+?[\d\s()-]{6,}$/.test(text)) return null; // nor is a bare phone number
  return text;
};

const mapSosRecord = (sos) => {
  const p = sos.patient_details || null;
  const u = sos.triggered_by || null;
  return {
    _id: sos._id,
    createdAt: sos.createdAt,
    patient_full_name: sos.patient_name || p?.patient_full_name || "N/A",
    gender: p?.gender || null,
    age: calcAge(p?.date_of_birth),
    uhid: p?.uhid || null,
    patient_status: p?.status || null,
    contact_number: sos.contact_number || p?.contact_number || null,
    // location_address: sos.address || p?.address || null,
    location_address:
      normalizeAddress(sos.address) || normalizeAddress(p?.address) || null,
    triggered_by_phone: u?.phone_number || null,
    triggered_by_name: u?.name || null,
    status: sos.status || "pending",
  };
};

export default function AllEmergencySos({
  searchQuery = "",
  dateRange = null,
}) {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSos, setSelectedSos] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // null | 'asc' | 'desc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [resolvingId, setResolvingId] = useState(null);

  const handleResolve = async (id) => {
    try {
      setResolvingId(id);
      const res = await API.emergencySos.resolveEmergencySos(id);
      if (res && res.status === "success") {
        toast.success("SOS alert resolved successfully");
        setSosList((prev) =>
          prev.map((sos) =>
            sos._id === id ? { ...sos, status: "resolved" } : sos
          )
        );
        // Refresh the sidebar badge count immediately
        useSosStore.getState().fetchSosCount(true);
      } else {
        toast.error(res?.message || "Failed to resolve SOS alert");
      }
    } catch (error) {
      toast.error("Failed to resolve SOS alert");
    } finally {
      setResolvingId(null);
    }
  };

  const handleUndo = async (id) => {
    try {
      setResolvingId(id);
      const res = await API.emergencySos.unresolveEmergencySos(id);
      if (res && res.status === "success") {
        toast.success("SOS alert reverted to pending");
        setSosList((prev) =>
          prev.map((sos) =>
            sos._id === id ? { ...sos, status: "pending" } : sos
          )
        );
        // Refresh the sidebar badge count immediately
        useSosStore.getState().fetchSosCount(true);
      } else {
        toast.error(res?.message || "Failed to revert SOS status");
      }
    } catch (error) {
      toast.error("Failed to revert SOS status");
    } finally {
      setResolvingId(null);
    }
  };

  const fetchSos = async () => {
    try {
      setLoading(true);
      const response = await API.emergencySos.getAllEmergencySos({
        page: 1,
        limit: 1000,
      });

      if (response && Array.isArray(response.data)) {
        setSosList(response.data.map(mapSosRecord));
      } else {
        setSosList([]);
      }
    } catch (error) {
      toast.error("Failed to fetch emergency SOS data");
      setSosList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchSos();
  }, [dateRange]);

  const handleDateSort = () => {
    if (sortOrder === null) setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder(null);
  };

  const filteredSos = sosList.filter((sos) => {
    const matchesSearch = searchQuery
      ? sos.patient_full_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sos.contact_number?.includes(searchQuery) ||
        sos.triggered_by_phone?.includes(searchQuery) ||
        sos.location_address?.toLowerCase().includes(searchQuery.toLowerCase())
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

    return matchesSearch && matchesDateRange;
  });

  const sortedSos = [...filteredSos].sort((a, b) => {
    if (sortOrder === null) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

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
          {searchQuery || dateRange
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
              Location
            </TableHead>
            <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
              Triggered By
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
            <TableHead className="text-[#7F7F7F] text-center font-normal py-3">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSos.map((sos, index) => (
            <TableRow
              key={sos._id}
              className={cn(
                "border-b border-gray-100 transition-all duration-200 group",
                sos.status === "resolved"
                  ? "bg-emerald-50/40 hover:bg-emerald-100/40 border-emerald-100/80"
                  : "hover:bg-red-50 hover:border-red-200"
              )}
            >
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">
                    {sos.patient_full_name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {sos.gender || "N/A"}
                    {sos.age ? `, ${sos.age} yrs` : ""}
                    {sos.uhid ? ` · ${sos.uhid}` : ""}
                  </div>
                </div>
              </TableCell>
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                {sos.contact_number || "N/A"}
              </TableCell>
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200 max-w-[220px]",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                <div className="flex items-start gap-1.5 text-sm text-gray-700">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {sos.location_address || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {sos.triggered_by_phone || "N/A"}
                </div>
              </TableCell>
              <TableCell className={cn(
                "border-r border-gray-200 py-3 transition-colors duration-200",
                sos.status === "resolved" ? "group-hover:border-emerald-200" : "group-hover:border-red-300"
              )}>
                {formatDateTime(sos.createdAt)}
              </TableCell>
              <TableCell className="py-3">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedSos(sos)}
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                    View
                  </Button>
                  {sos.status === "resolved" ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200/50 select-none">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>Resolved</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-gray-100 cursor-pointer rounded-full"
                        onClick={() => handleUndo(sos._id)}
                        disabled={resolvingId === sos._id}
                        title="Undo / Revert to Pending"
                      >
                        {resolvingId === sos._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                      onClick={() => handleResolve(sos._id)}
                      disabled={resolvingId === sos._id}
                    >
                      {resolvingId === sos._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Resolve
                    </Button>
                  )}
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

      {/* Emergency SOS Details Modal */}
      {selectedSos && (
        <EmergencySosDetailsModal
          sos={selectedSos}
          onClose={() => setSelectedSos(null)}
        />
      )}
    </div>
  );
}
