"use client"

import { Ellipsis, Eye, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddDepartmentModal } from "./add-department-modal"



export function DepartmentCard({ department, onDelete, onEdit }) {
    const handleDelete = (id) => {
        if (onDelete) {
            onDelete(id)
        }
    }

    return (
        <Card className="relative border border-[#E2E2E2] cursor-pointer bg-[#FFFFFF] rounded-[10px] transition-colors duration-300 shadow-none py-0">
            <CardContent className="px-2 py-2 gap-0 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <Image
                            width={100}
                            height={100}
                            className="size-12"
                            src={department.icon || "/placeholder.svg"}
                            alt={department.id}
                        />
                        <h3 className="text-base font-medium text-[#323232]">{department.name}</h3>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Ellipsis className="w-5 h-5 text-[#656565]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/dashboard/departments/${department.id}`}>
                                <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>
                            </Link>

                            <AddDepartmentModal department={department} onSave={onEdit}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Department
                                </DropdownMenuItem>
                            </AddDepartmentModal>

                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(department.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Department
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="bg-[#FFFFFF] border border-[#EEEEEE] rounded-[6px] flex items-center justify-center p-1.5">
                            <Image
                                src="/assets/images/dashboard/doctor.svg"
                                width={100}
                                height={100}
                                className="w-6 h-6"
                                alt="totalDoctor"
                            />
                        </div>
                        <div>
                            <h4 className="text-xs text-[#7F7F7F]">Doctors</h4>
                            <p className="text-sm text-[#4B4B4B] font-medium">{department.doctorsCount || 12}</p>
                        </div>
                    </div>
                    <div className="h-[30px] w-[1.2px] bg-[#DDDDDD]"></div>
                    <div className="flex gap-1.5">
                        <div className="bg-[#FFFFFF] border border-[#EEEEEE] rounded-[6px] flex items-center justify-center p-1.5">
                            <Image
                                src="/assets/images/dashboard/totalPatient.svg"
                                width={100}
                                height={100}
                                className="w-6 h-6"
                                alt="totalPatient"
                            />
                        </div>
                        <div>
                            <h4 className="text-xs text-[#7F7F7F]">Patients</h4>
                            <p className="text-sm text-[#4B4B4B] font-medium">{department.patientsCount || 40}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
