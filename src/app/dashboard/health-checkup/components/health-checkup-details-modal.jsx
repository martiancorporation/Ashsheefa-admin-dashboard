"use client"

import React from "react"
import { useState } from "react"
import Image from "next/image"
import { X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddHealthCheckupModal } from "./add-health-checkup-modal"
import { toast } from "sonner"
import healthCheckup from "@/api/healthCheckup"

export function HealthCheckupDetailsModal({ healthPackage, onClose, onSave }) {
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setOpen(false)
        if (onClose) {
            onClose()
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this health checkup?")) {
            setLoading(true)
            try {
                const response = await healthCheckup.deleteHealthCheckup(healthPackage._id)
                if (response) {
                    toast.success("Health checkup deleted successfully")
                    handleClose()
                    if (onSave) {
                        onSave()
                    }
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
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-scroll overscroll-y-contain eme-scroll">
                <DialogHeader>
                    <DialogTitle className={`text-[#4B4B4B] font-medium`}>
                        Health checkup details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    {/* Image */}
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                        {healthPackage.image ? (
                            <Image
                                src={healthPackage.image}
                                alt={healthPackage.checkup_name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-blue-600 text-xl font-bold">
                                            {healthPackage.checkup_name?.charAt(0) || "H"}
                                        </span>
                                    </div>
                                    <p className="text-blue-600 text-sm font-medium">Health Checkup</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Package Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {healthPackage.featured && (
                                <div className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-[3px]">
                                    Featured
                                </div>
                            )}
                            {!healthPackage.is_active && (
                                <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-[3px]">
                                    Inactive
                                </div>
                            )}
                        </div>
                        <h2 className="text-base font-medium text-gray-900">
                            {healthPackage.checkup_name}
                        </h2>
                        {healthPackage.checkup_title && (
                            <p className="text-gray-600 text-sm mt-1">
                                {healthPackage.checkup_title}
                            </p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                            {healthPackage.tests?.length || 0} tests included
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-[#4A4A4B]">Original Price</p>
                            <p className="font-medium text-base text-[#323232] rounded-[6px] border border-[#DDDDDD] py-1 px-3">
                                ₹{healthPackage.original_price}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-[#4A4A4B]">Discount Price</p>
                            <p className="font-medium text-base text-[#323232] rounded-[6px] border border-[#DDDDDD] py-1 px-3">
                                ₹{healthPackage.discount_price}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {healthPackage.description && (
                        <div>
                            <p className="text-sm text-[#4A4A4B] mb-2">Description</p>
                            <p className="text-gray-700 text-sm bg-gray-50 rounded-[6px] border border-[#DDDDDD] py-2 px-3">
                                {healthPackage.description}
                            </p>
                        </div>
                    )}

                    {/* Tests */}
                    <div>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-600">All Tests</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <ScrollArea className="h-[250px] pr-4 text-sm">
                            {healthPackage.tests && healthPackage.tests.length > 0 ? (
                                <ul className="space-y-3">
                                    {healthPackage.tests.map((test, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-gray-500 mr-2">•</span>
                                            <span className="text-gray-700">{test}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No tests available</p>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {loading ? "Deleting..." : "Delete checkup"}
                        </Button>

                        <AddHealthCheckupModal healthPackage={healthPackage} onSave={onSave}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit checkup
                            </Button>
                        </AddHealthCheckupModal>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
