"use client"

import Image from "next/image"
import { X, Pencil, Trash2, Phone, Calendar, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"


export function DoctorDetailsModal({ children, doctor, onEdit, onDelete }) {
    const [open, setOpen] = useState(false)

    const handleEdit = () => {
        setOpen(false)
        if (onEdit) onEdit()
    }

    const handleDelete = () => {
        setOpen(false)
        if (onDelete) onDelete()
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="flex justify-between items-center">
                    <DialogTitle>Doctors Details</DialogTitle>
                    
                    <DialogDescription>
                       
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center mt-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        {doctor.photoUrl ? (
                            <Image
                                src={doctor.photoUrl || "/placeholder.svg"}
                                alt={doctor.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-blue-600"
                            >
                                <path
                                    d="M18 18C22.1421 18 25.5 14.6421 25.5 10.5C25.5 6.35786 22.1421 3 18 3C13.8579 3 10.5 6.35786 10.5 10.5C10.5 14.6421 13.8579 18 18 18Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 33C3 27.3696 7.77031 22.5 13.5 22.5H22.5C28.2297 22.5 33 27.3696 33 33"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold">{doctor.name}</h2>
                        <p className="text-gray-500">
                            {doctor.degree}, {doctor.regNo}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
                            <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500 text-sm">Contact number</p>
                            <p className="font-medium">{doctor.contactNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-blue-600"
                            >
                                <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12.5 7.5C12.5 7.77614 12.2761 8 12 8C11.7239 8 11.5 7.77614 11.5 7.5C11.5 7.22386 11.7239 7 12 7C12.2761 7 12.5 7.22386 12.5 7.5Z"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 17V10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500 text-sm">Department</p>
                            <p className="font-medium">{doctor.department}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500 text-sm">Experience</p>
                            <p className="font-medium">{doctor.experience} Years</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
                            <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500 text-sm">Language</p>
                            <p className="font-medium">{doctor.languages.join(", ")}</p>
                        </div>
                    </div>

                    <div className="flex items-start col-span-2">
                        <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-500 text-sm">Available</p>
                            <p className="font-medium">{doctor.availableDays.join(", ")}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 flex justify-end gap-4">
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Doctor
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Doctor
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
