"use client"

import React from "react"
import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import internationalPatient from "@/api/internationalPatient"

export function UpdateStatusModal({ open, onOpenChange, patient, onSave }) {
    const [loading, setLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("")

    // Initialize status when modal opens
    React.useEffect(() => {
        if (open && patient) {
            setSelectedStatus(patient.status || "")
        }
    }, [open, patient])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedStatus.trim()) {
            toast.error("Please select a status")
            return
        }

        setLoading(true)
        try {
            const updateData = {
                status: selectedStatus.trim()
            }

            const response = await internationalPatient.updateInternationalPatient(patient._id, updateData)

            if (response) {
                toast.success("Status updated successfully")
                onOpenChange(false)
                if (onSave) {
                    onSave()
                }
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("An error occurred while updating the status")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    const statusOptions = [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Confirmed", label: "Confirmed" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className="text-[#4B4B4B] text-base">
                            Update Patient Status
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Info */}
                    {patient && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Patient Information</h3>
                            <div className="text-sm text-gray-600">
                                <p><strong>Name:</strong> {patient.patient_full_name}</p>
                                <p><strong>Country:</strong> {patient.country}</p>
                                <p><strong>Current Status:</strong> {patient.status || "Not set"}</p>
                            </div>
                        </div>
                    )}

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-[#4A4A4B] text-sm">
                            New Status*
                        </Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#005CD4] hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 