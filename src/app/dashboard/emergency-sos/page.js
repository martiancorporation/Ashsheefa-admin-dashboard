"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Calendar as CalendarIcon,
  X,
  Siren,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import AllEmergencySos from "./components/all-emergency-sos";

export default function EmergencySosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Date filter state
  const [dateRange, setDateRange] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const statusOptions = [
    { name: "All Status" },
    { name: "Pending" },
    { name: "Dispatched" },
    { name: "En Route" },
    { name: "Resolved" },
    { name: "Cancelled" },
  ];

  const typeOptions = [
    { name: "All Types" },
    { name: "Cardiac" },
    { name: "Accident" },
    { name: "Breathing" },
    { name: "Stroke" },
    { name: "Pregnancy" },
    { name: "Trauma" },
    { name: "Other" },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSosUpdate = () => {
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
          <Link href="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium flex items-center gap-2">
            <Siren className="w-4 h-4 text-red-500" />
            Emergency SOS
          </p>
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
                  value={status.name.toLowerCase().replace(/\s+/g, "-")}
                >
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((type, index) => (
                <SelectItem
                  key={index}
                  value={type.name.toLowerCase().replace(/\s+/g, "-")}
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          dateRange={dateRange}
          onSosUpdate={handleSosUpdate}
        />
      </div>
    </>
  );
}
