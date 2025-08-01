"use client"

import React, { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import healthCheckup from "@/api/healthCheckup"

export function DeleteConfirmationModal({ healthPackage, onClose, onDeleteSuccess }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!healthPackage?._id) {
            toast.error("Invalid health checkup")
            return
        }

        setLoading(true)
        try {
            const response = await healthCheckup.deleteHealthCheckup(healthPackage._id)
            if (response) {
                toast.success("Health checkup deleted successfully")
                onDeleteSuccess?.()
                onClose()
            } else {
                toast.error("Failed to delete health checkup")
            }
        } catch (error) {
            console.error("Error deleting health checkup:", error)
            toast.error("An error occurred while deleting the health checkup")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={!!healthPackage} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Delete Health Checkup
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to delete the health checkup{" "}
                        <span className="font-semibold text-gray-900">
                            "{healthPackage?.checkup_name}"
                        </span>
                        ?
                    </p>
                    <p className="text-sm text-gray-500">
                        This action cannot be undone. All data associated with this health checkup will be permanently removed.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Health Checkup
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 