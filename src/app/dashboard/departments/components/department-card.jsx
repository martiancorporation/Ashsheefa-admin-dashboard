"use client"

import { Ellipsis, Eye, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddDepartmentModal } from "./add-department-modal"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export function DepartmentCard({ department, onDelete, onEdit, openEditModal }) {
    const handleDelete = (id) => {
        if (onDelete) {
            onDelete(id)
        }
    }

    const handleEdit = () => {
        if (openEditModal) {
            openEditModal(department)
        }
    }

    return (
        <Card className="w-full border border-[#E2E2E2] bg-[#ffffff] rounded-[12px] transition-shadow duration-200 hover:shadow-sm p-0 pb-4 shadow-none">
            <CardContent className="w-full px-3 py-2  gap-0 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="size-14 rounded-full bg-[#EFF6FF] flex items-center justify-center overflow-hidden shrink-0">
                            <Image
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover"
                                src={
                                    department?.department_logo ||
                                    department?.logo ||
                                    department?.icon ||
                                    "/assets/images/department/oncology.svg"
                                }
                                alt={department?.name || department?.department_name || "department"}
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-[#323232] truncate">
                                {department?.name}
                            </h3>
                            {department?.label && (
                                <p className="text-xs text-[#7F7F7F] truncate">{department?.label}</p>
                            )}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Ellipsis className="w-5 h-5 text-[#656565]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/dashboard/departments/${department._id || department.id}`}>
                                <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Department
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleEdit}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Department
                            </DropdownMenuItem>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Department
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{department.department_name || department.name}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => handleDelete(department._id || department.id)}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {department.title || department.treatment_title ? (
                    <div className="text-xs text-[#7F7F7F] line-clamp-2">
                        {department.title || department.treatment_title}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}
