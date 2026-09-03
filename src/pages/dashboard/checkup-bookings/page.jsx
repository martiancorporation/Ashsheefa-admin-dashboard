import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import AllCheckupBookings from "./components/all-checkup-bookings";
import { AddBookingModal } from "./components/add-booking-modal";
import { exportCheckupBookingsToExcel } from "./components/export-checkup-bookings";
import { CHECKUP_STATUSES } from "./components/constants";

export default function CheckupBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Rows currently visible in the table (filters applied) — published by the
  // table so the export matches exactly what is on screen.
  const [visibleBookings, setVisibleBookings] = useState([]);
  const [exporting, setExporting] = useState(false);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const handleExportToExcel = async () => {
    if (!visibleBookings.length) {
      toast.error("No bookings to export");
      return;
    }
    try {
      setExporting(true);
      await exportCheckupBookingsToExcel(visibleBookings);
      toast.success(
        `Exported ${visibleBookings.length} checkup booking${
          visibleBookings.length === 1 ? "" : "s"
        } to Excel`
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export bookings");
    } finally {
      setExporting(false);
    }
  };

  const getDateRangeLabel = () => {
    if (!dateRange?.from) return "Select Date";
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    }
    return format(dateRange.from, "MMM dd, yyyy");
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Checkup Bookings</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              {CHECKUP_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPaymentStatus}
            onValueChange={setSelectedPaymentStatus}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-payments">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Collection date range */}
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full md:w-[140px] justify-start text-left font-normal ${
                    !dateRange && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{getDateRangeLabel()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Button
                    onClick={() => setIsCalendarOpen(false)}
                    className="w-full cursor-pointer"
                    size="sm"
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDateRange(null);
                  setIsCalendarOpen(false);
                }}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patient, package, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[220px]"
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
            Add Checkup Booking
          </Button>

          {/* Overflow actions — keeps the header from getting any wider */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 cursor-pointer"
                aria-label="More actions"
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <DropdownMenuItem
                onClick={handleExportToExcel}
                disabled={exporting || visibleBookings.length === 0}
                className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 mr-2 text-gray-500 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                )}
                {exporting ? "Exporting..." : "Export to Excel"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
        <AllCheckupBookings
          key={refreshKey}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedPaymentStatus={selectedPaymentStatus}
          dateRange={dateRange}
          onVisibleBookingsChange={setVisibleBookings}
        />
      </div>

      <AddBookingModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleRefresh}
      />
    </>
  );
}
