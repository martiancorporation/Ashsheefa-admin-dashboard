"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

export function FilterModal({ isOpen, onClose, onApply, onClear, hasActiveFilters, patients = [] }) {
    const [filters, setFilters] = useState({
        department: "all",
        gender: "all",
    })

    // Get unique values from patients data for filter options
    const departments = [...new Set(patients.map(patient => patient.department).filter(Boolean))]
    const genders = ["Male", "Female", "Other"]

    const handleSelectChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }))
    }

    const handleApply = () => {
        onApply(filters)
        onClose()
    }

    const handleRemove = () => {
        setFilters({
            department: "all",
            gender: "all",
        })
        onApply({
            department: "all",
            gender: "all",
        })
        onClose()
    }

    const handleClose = () => {
        onClose()
    }

    // Count active filters (excluding "all" values)
    const activeFilterCount = Object.values(filters).filter(value => value !== "all").length

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            Filter Patients Enquiry
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <Select
                            value={filters.department}
                            onValueChange={(value) => handleSelectChange("department", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <Select
                            value={filters.gender}
                            onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                {genders.map((gender) => (
                                    <SelectItem key={gender} value={gender}>
                                        {gender}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={handleRemove}
                        className="cursor-pointer"
                    >
                        Clear All
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                            Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 