"use client"

import React from "react"
import { X, User, Phone, Calendar, MapPin, Stethoscope, FileText, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function AppointmentDetailsModal({ appointment, onClose, onSave }) {
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
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'in progress':
                return 'bg-orange-100 text-orange-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (!appointment) return null

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-[#4B4B4B] text-base">
                            Appointment Details
                        </DialogTitle>
                       
                    </div>
                </DialogHeader>

                <div className="space-y-3">
                   

                    {/* Patient Information */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">

                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Patient Information
                            </h3>
                            {/* Status Badge */}
                            <div className="flex justify-center">
                                <Badge className={`text-sm px-3 py-1 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                                    {appointment.status || "Not set"}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Full Name:</span>
                                <p className="text-gray-900">{appointment.patient_full_name || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Age:</span>
                                <p className="text-gray-900">{appointment.age || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Gender:</span>
                                <p className="text-gray-900">{appointment.gender || "Not specified"}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Contact Number:</span>
                                <p className="text-gray-900 flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {appointment.contact_number || "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Information */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Appointment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Appointment Date:</span>
                                <p className="text-gray-900">{formatDate(appointment.appointment_date)}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Department:</span>
                                <p className="text-gray-900 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {appointment.speciality || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Refer Doctor:</span>
                                <p className="text-gray-900 flex items-center">
                                    <Stethoscope className="h-3 w-3 mr-1" />
                                    {appointment.refer_doctor || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Status:</span>
                                <p className="text-gray-900 flex items-center">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    {appointment.status || "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Details */}
                    {appointment.medical_issue_details && (
                        <div className="bg-green-50 p-3 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Medical Issue Details
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {appointment.medical_issue_details}
                            </p>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="text-gray-900">
                                    {appointment.createdAt ? formatDate(appointment.createdAt) : "Not available"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Last Updated:</span>
                                <p className="text-gray-900">
                                    {appointment.updatedAt ? formatDate(appointment.updatedAt) : "Not available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
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