"use client"

import React, { useState } from "react"
import { X, Calendar, Phone, MapPin, User, FileText, UserCheck, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddInternationalPatientModal } from "./add-international-patient-modal"
import { toast } from "sonner"
import internationalPatient from "@/api/internationalPatient"

export function InternationalPatientDetailsModal({ patient, onClose, onSave }) {
    const [editModalOpen, setEditModalOpen] = useState(false)

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800'
            case 'in progress':
                return 'bg-orange-100 text-orange-800'
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'discharged':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleDelete = async () => {
        try {
            const response = await internationalPatient.deleteInternationalPatient(patient._id)
            if (response) {
                toast.success("International patient deleted successfully")
                onClose()
                if (onSave) {
                    onSave()
                }
            }
        } catch (error) {
            console.error("Error deleting international patient:", error)
            toast.error("Failed to delete international patient")
        }
    }

    if (!patient) return null

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-[#4B4B4B] text-lg font-semibold">
                                Patient Details
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* Header with Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-[#323232]">
                                        {patient.patient_full_name}
                                    </h2>
                                    <p className="text-sm text-[#7F7F7F]">
                                        {patient.age === 0 ? "Not specified" : `${patient.age} years`} • {patient.gender}
                                    </p>
                                </div>
                            </div>
                            <Badge className={`px-3 py-1 rounded-full ${getStatusBadgeColor(patient.status)}`}>
                                {patient.status || "Unknown"}
                            </Badge>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#323232] border-b pb-2">
                                Contact Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Contact Number</p>
                                        <p className="font-medium text-[#323232]">
                                            {patient.contact_number || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Country</p>
                                        <p className="font-medium text-[#323232]">
                                            {patient.country || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#323232] border-b pb-2">
                                Medical Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-blue-600">Speciality</p>
                                        <p className="font-medium text-[#323232]">
                                            {patient.speciality || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <UserCheck className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-blue-600">Refer Doctor</p>
                                        <p className="font-medium text-[#323232]">
                                            {patient.refer_doctor ? `Dr. ${patient.refer_doctor}` : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {patient.medical_issue_details && (
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-yellow-600 font-medium mb-1">
                                                Medical Issue Details
                                            </p>
                                            <p className="text-[#323232] whitespace-pre-wrap">
                                                {patient.medical_issue_details}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Appointment Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#323232] border-b pb-2">
                                Appointment Information
                            </h3>

                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Appointment Date</p>
                                    <p className="font-medium text-[#323232]">
                                        {formatDate(patient.appointment_date)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Passport Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#323232] border-b pb-2">
                                Travel Information
                            </h3>

                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 font-bold text-sm">P</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-600 font-medium">Passport Number</p>
                                        <p className="font-mono font-medium text-[#323232] text-lg">
                                            {patient.passport_number || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#323232] border-b pb-2">
                                System Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Patient ID</p>
                                    <p className="font-mono text-[#323232]">{patient._id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Created</p>
                                    <p className="text-[#323232]">
                                        {new Date(patient.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Last Updated</p>
                                    <p className="text-[#323232]">
                                        {new Date(patient.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Status</p>
                                    <p className="text-[#323232]">
                                        {patient.is_active ? "Active" : "Inactive"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                onClick={() => setEditModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                                Edit Patient
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="destructive"
                                className="flex-1"
                            >
                                Delete Patient
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <AddInternationalPatientModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                patient={patient}
                onSave={onSave}
            />
        </>
    )
} 