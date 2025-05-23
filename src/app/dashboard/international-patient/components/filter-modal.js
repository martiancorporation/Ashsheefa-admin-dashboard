"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterModal({ isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    gender: "",
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      department: "",
      status: "",
      gender: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filter Patients</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select
              value={filters.department}
              onValueChange={(value) =>
                setFilters({ ...filters, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select
              value={filters.gender}
              onValueChange={(value) =>
                setFilters({ ...filters, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="px-4 py-2"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
