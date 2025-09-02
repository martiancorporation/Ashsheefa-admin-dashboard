"use client"

import Image from "next/image"
import { X, Phone, Calendar, Globe, Clock, Mail, User, Award, MapPin, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function DoctorDetailsModal({ open, onOpenChange, doctor }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-[#ffffff]">
                <DialogHeader className="flex justify-between items-start pb-4">
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900">Doctor Details</DialogTitle>
                        <DialogDescription className="text-gray-600 text-sm">
                            View doctor information
                        </DialogDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="h-6 w-6 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Doctor Header */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {doctor.profilePic ? (
                                    <Image
                                        src={doctor.profilePic || "/placeholder.svg"}
                                        alt={doctor.fullName}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="h-8 w-8 text-gray-400" />
                                )}
                            </div>
                            <Badge
                                variant={doctor.isActive ? "default" : "secondary"}
                                className={`absolute -bottom-1 -right-1 text-xs ${doctor.isActive
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-gray-400 hover:bg-gray-500"
                                    } text-white border border-white`}
                            >
                                {doctor.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-gray-900 truncate">{doctor.fullName}</h2>
                            <p className="text-sm text-gray-600 mb-1">{doctor.qualification}</p>
                            <div className="flex flex-wrap gap-1 text-xs">
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {doctor.department}
                                </span>
                                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                                    ID: {doctor.doctorId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 gap-3">
                        {/* Contact Information */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-blue-600" />
                                Contact
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="font-medium">{doctor.contactNumber || "Not provided"}</span>
                                </div>
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium">{doctor.email || "Not provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                <Award className="h-4 w-4 mr-1 text-blue-600" />
                                Professional
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Dept:</span>
                                    <span className="font-medium">{doctor.department}</span>
                                </div>
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Exp:</span>
                                    <span className="font-medium">{doctor.experience || "Not specified"}</span>
                                </div>
                                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-500">Reg:</span>
                                    <span className="font-medium">{doctor.regNo}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specialization */}
                        {doctor.specialization && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                    <Award className="h-4 w-4 mr-1 text-blue-600" />
                                    Specialization
                                </h3>
                                <div className="p-2 bg-gray-50 rounded text-sm">
                                    <span className="font-medium">{doctor.specialization}</span>
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {doctor.languages && doctor.languages.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                    <Globe className="h-4 w-4 mr-1 text-blue-600" />
                                    Languages
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {doctor.languages.map((language) => (
                                        <Badge key={language} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                            {language}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                Availability
                            </h3>
                            {doctor.availability && doctor.availability.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {doctor.availability.map((avail, index) => (
                                        <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                                            <div className="font-medium text-green-800">{avail.day}</div>
                                            <div className="text-green-600">
                                                {avail.startTime} - {avail.endTime}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm text-center text-gray-500">
                                    No schedule set
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {doctor.bio && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900">Biography</h3>
                                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                                    <p className="text-gray-700">{doctor.bio}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
