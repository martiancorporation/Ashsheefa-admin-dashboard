"use client"

import React, { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import internationalPatient from "@/api/internationalPatient"

export function DeleteConfirmationModal({ patient, onClose, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!patient) return

        setLoading(true)
        try {
            const response = await internationalPatient.deleteInternationalPatient(patient._id)
            if (response) {
                toast.success("International patient deleted successfully")
                if (onDeleteSuccess) {
                    onDeleteSuccess()
                }
                onClose()
            }
        } catch (error) {
            console.error("Error deleting international patient:", error)
            toast.error("Failed to delete international patient")
        } finally {
            setLoading(false)
        }
    }

    if (!patient) return null

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#4B4B4B] text-lg font-semibold">
                        Delete International Patient
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <div>
                            <p className="text-red-800 font-medium">
                                Are you sure you want to delete this patient?
                            </p>
                            <p className="text-red-700 text-sm mt-1">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Patient Details:</p>
                        <p className="font-medium text-[#323232]">
                            {patient.patient_full_name}
                        </p>
                        <p className="text-sm text-[#7F7F7F]">
                            {patient.age} years • {patient.gender} • {patient.country}
                        </p>
                        <p className="text-sm text-[#7F7F7F]">
                            Passport: {patient.passport_number}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            disabled={loading}
                            className="flex-1"
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 