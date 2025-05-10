"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function FilterModal({ isOpen, onClose, onApply }) {
    const [filters, setFilters] = useState({
        department: "",
        doctor: "",
        facilities: "",
    })

    const handleSelectChange = (name, value) => {
        setFilters((prev) => ({ ...prev,[name]: value }))
    }

    const handleApply = () => {
        onApply(filters)
        onClose()
    }

    const handleRemove = () => {
        setFilters({
            department: "",
            doctor: "",
            facilities: "",
        })
        onApply({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium mb-4">Filter</h2>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="department" className="block text-sm mb-1">
                                Department
                            </label>
                            <Select value={filters.department} onValueChange={(value) => handleSelectChange("department", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                    <SelectItem value="cardiology">Cardiology</SelectItem>
                                    <SelectItem value="neurology">Neurology</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="doctor" className="block text-sm mb-1">
                                Doctor
                            </label>
                            <Select value={filters.doctor} onValueChange={(value) => handleSelectChange("doctor", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dr-hashim">Dr. Hashim</SelectItem>
                                    <SelectItem value="dr-sen">Dr. Sen</SelectItem>
                                    <SelectItem value="dr-sharma">Dr. Sharma</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="facilities" className="block text-sm mb-1">
                                Facilities
                            </label>
                            <Select value={filters.facilities} onValueChange={(value) => handleSelectChange("facilities", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lab">Lab</SelectItem>
                                    <SelectItem value="xray">X-Ray</SelectItem>
                                    <SelectItem value="mri">MRI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={handleRemove}>
                            Remove
                        </Button>
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
