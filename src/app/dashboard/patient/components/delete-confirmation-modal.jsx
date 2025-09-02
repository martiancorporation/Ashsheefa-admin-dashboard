"use client"

import React from "react"
import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import patient from "@/api/patient"

export function DeleteConfirmationModal({ patient: patientData, onClose, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!patientData) return

        setLoading(true)
        try {
            const response = await patient.deletePatient(patientData._id)

            if (response) {
                toast.success("Patient deleted successfully")
                onClose()
                if (onDeleteSuccess) {
                    onDeleteSuccess()
                }
            } else {
                toast.error("Failed to delete patient")
            }
        } catch (error) {
            console.error("Error deleting patient:", error)
            toast.error("An error occurred while deleting the patient")
        } finally {
            setLoading(false)
        }
    }

    if (!patientData) return null

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Delete Patient
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                Are you sure you want to delete this patient? This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Patient Details</h3>
                    <div className="text-sm text-red-700 space-y-1">
                        <p><strong>UHID:</strong> {patientData.uhid}</p>
                        <p><strong>Name:</strong> {patientData.patient_full_name}</p>
                        <p><strong>Department:</strong> {patientData.speciality}</p>
                        <p><strong>Contact:</strong> {patientData.contact_number}</p>
                        <p><strong>Status:</strong> {patientData.status}</p>
                    </div>
                </div>

                <DialogFooter className="gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Patient"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 