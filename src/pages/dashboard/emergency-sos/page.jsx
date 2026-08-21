import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Calendar as CalendarIcon,
  X,
  Siren,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import AllEmergencySos from "./components/all-emergency-sos";
// NEW SOS FLOW (unread + resolved/unresolved chips) — ACTIVE.
import useSosStore from "@/store/sosStore";

export default function EmergencySosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const unresolvedCount = useSosStore((state) => state.unresolved);
  const resolvedCount = useSosStore((state) => state.resolved);

  // Opening this page = reading all current SOS: clear the unread badge/popup,
  // then refresh the counts shown in the header chips. Mount-only, so a manual
  // refresh (or a test trigger) doesn't silently re-mark new SOS as read.
  //
  // ── OLD FLOW: this effect and the Unresolved/Resolved chips below did not
  // exist (no unread tracking). To restore it, delete this effect, the two
  // count selectors above, and the chips block in the toolbar. ──
  useEffect(() => {
    const store = useSosStore.getState();
    store.markAllSeen();
    store.fetchSosCount(true);
  }, []);

  // ── SOS POLLING (auto-refresh) ───────────────────────────────────────────
  // The sidebar polls the counts in the background. When a NEW SOS lands while
  // the admin is sitting on this page, reload the table so the row appears
  // without a manual refresh. Keyed on the unresolved count RISING, so the
  // table doesn't flicker on every poll — only when there's actually new data.
  //
  // ⚠️ Remove this block (and the poller in Sidebar.jsx + SOS_POLL_INTERVAL_MS
  // in the store) if background polling isn't wanted.
  const prevUnresolvedRef = useRef(null);
  useEffect(() => {
    if (prevUnresolvedRef.current === null) {
      prevUnresolvedRef.current = unresolvedCount; // first read — nothing to compare
      return;
    }
    if (unresolvedCount > prevUnresolvedRef.current) {
      setRefreshKey((prev) => prev + 1); // new SOS arrived → reload the table
    }
    prevUnresolvedRef.current = unresolvedCount;
  }, [unresolvedCount]);

  // Date filter state
  const [dateRange, setDateRange] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };


  const handleDateSelect = (range) => {
    setDateRange(range);
    if (range && !range.from && !range.to) {
      setIsCalendarOpen(false);
    }
  };

  const clearDateFilter = () => {
    setDateRange(null);
    setIsCalendarOpen(false);
  };

  const getDateRangeLabel = () => {
    if (!dateRange) return "Select Date";

    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
      }
      return format(dateRange.from, "MMM dd, yyyy");
    }

    return "Select Date";
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium flex items-center gap-2">
            <Siren className="w-4 h-4 text-red-500 animate-pulse" />
            Emergency SOS
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full md:w-[200px] justify-start text-left font-normal ${
                    !dateRange && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getDateRangeLabel()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateSelect}
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
                onClick={clearDateFilter}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* SOS status counts */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Unresolved: {unresolvedCount}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Resolved: {resolvedCount}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, contact, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full md:w-[280px]"
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
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll">
        <AllEmergencySos
          key={refreshKey}
          searchQuery={searchQuery}
          dateRange={dateRange}
        />
      </div>
    </>
  );
}
