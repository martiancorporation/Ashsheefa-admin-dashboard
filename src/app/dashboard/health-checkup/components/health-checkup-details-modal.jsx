"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddHealthCheckupModal } from "./add-health-checkup-modal"



export function HealthCheckupDetailsModal({ children, healthPackage, onDelete }) {
    const [open, setOpen] = useState(false)

    const handleDelete = () => {
        setOpen(false)
        if (onDelete) {
            onDelete(healthPackage.id)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh]  overflow-y-scroll overscroll-y-contain eme-scroll">
                <DialogHeader className="">
                    <DialogTitle className={`text-[#4B4B4B] font-medium`}>Health checkup details</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                        <Image
                            src={healthPackage.image || "/placeholder.svg"}
                            alt={healthPackage.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <div className="inline-block bg-[#E3F8BC] text-[#323232] text-xs px-2 py-1 rounded-[3px] ">
                            {healthPackage.category}
                        </div>
                        <h2 className="text-base font-medium">{healthPackage.name}</h2>
                        <p className="text-gray-500 text-sm">{healthPackage.tests} tests included</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className=" text-sm text-[#4A4A4B]" >Original Price</p>
                            <p className="font-medium text-base text-[#323232] rounded-[6px] border border-[#DDDDDD] py-1 px-3">{healthPackage.originalPrice}</p>
                        </div>
                        <div>
                            <p className="t text-sm text-[#4A4A4B]">Discount Price</p>
                            <p className="font-medium text-base text-[#323232] rounded-[6px] border border-[#DDDDDD] py-1 px-3">{healthPackage.discountPrice}</p>
                        </div>
                    </div>

                    <div>
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-600">All Tests</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <ScrollArea className="h-[250px] pr-4 text-sm">
                            <ul className="space-y-3">
                                {healthPackage.testDetails.map((test, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-gray-500 mr-2">•</span>
                                        <span className="text-gray-700">{test}</span>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete checkup
                        </Button>

                        <AddHealthCheckupModal healthPackage={healthPackage}>
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
