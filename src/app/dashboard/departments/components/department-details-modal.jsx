"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddDepartmentModal } from "./add-department-modal"



export function DepartmentDetailsModal({ children, department, onDelete }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        setOpen(false)
        if (onDelete) {
            onDelete(department.id)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-[#323232]">Department Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            <Image
                                src={
                                    department?.department_logo ||
                                    department?.logo ||
                                    department?.icon ||
                                    "/assets/images/department/oncology.svg"
                                }
                                alt={department?.name || department?.department_name || "department"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold">{department.name || department.department_name} Department</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Total Doctors</p>
                            <p className="text-xl font-bold">{department.doctorsCount || 12}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-500 text-sm">Total Patients</p>
                            <p className="text-xl font-bold">{department.patientsCount || 23}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Department
                        </Button>

                        <AddDepartmentModal department={department}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Department
                            </Button>
                        </AddDepartmentModal>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
