"use client"

import React from "react"
import { X, User, Phone, Calendar, MapPin, Stethoscope, FileText, UserCheck, Hash, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function PatientDetailsModal({ patient, onClose, onSave }) {
    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'in treatment':
                return 'bg-blue-100 text-blue-800'
            case 'discharged':
                return 'bg-green-100 text-green-800'
            case 'under observation':
                return 'bg-yellow-100 text-yellow-800'
            case 'scheduled':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (!patient) return null

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-[#4B4B4B] text-base">
                            Patient Details
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <Badge className={`text-sm px-3 py-1 rounded-full ${getStatusBadgeColor(patient.status)}`}>
                            {patient.status || "Not set"}
                        </Badge>
                    </div>

                    {/* UHID Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Hash className="h-4 w-4 mr-2" />
                            Patient UHID
                        </h3>
                        <div className="text-sm">
                            <p className="text-gray-900 font-mono text-lg">{patient.uhid || "Not assigned"}</p>
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Patient Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Full Name:</span>
                                <p className="text-gray-900">{patient.patient_full_name || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Age:</span>
                                <p className="text-gray-900">{patient.age || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Gender:</span>
                                <p className="text-gray-900">{patient.gender || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Contact Number:</span>
                                <p className="text-gray-900 flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {patient.contact_number || "Not specified"}
                                </p>
                            </div>
                            {patient.country && (
                                <div>
                                    <span className="font-medium text-gray-700">Country:</span>
                                    <p className="text-gray-900 flex items-center">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {patient.country}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Medical Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Appointment Date:</span>
                                <p className="text-gray-900">{formatDate(patient.appointment_date)}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Department:</span>
                                <p className="text-gray-900 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {patient.speciality || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Refer Doctor:</span>
                                <p className="text-gray-900 flex items-center">
                                    <Stethoscope className="h-3 w-3 mr-1" />
                                    {patient.refer_doctor || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Status:</span>
                                <p className="text-gray-900 flex items-center">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    {patient.status || "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Details */}
                    {patient.medical_issue_details && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Medical Issue Details
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {patient.medical_issue_details}
                            </p>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="text-gray-900">
                                    {patient.createdAt ? formatDate(patient.createdAt) : "Not available"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Last Updated:</span>
                                <p className="text-gray-900">
                                    {patient.updatedAt ? formatDate(patient.updatedAt) : "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 