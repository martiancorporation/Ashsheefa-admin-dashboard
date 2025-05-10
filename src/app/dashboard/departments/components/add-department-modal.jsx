"use client"

import  React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"


export function AddDepartmentModal({ children, department, onSave }) {
    const fileInputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [photoUrl, setPhotoUrl] = useState(department?.icon || "")
    const [departmentName, setDepartmentName] = useState(department?.name || "")

    const handlePhotoUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setPhotoUrl(event.target.result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDeletePhoto = () => {
        setPhotoUrl("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            name: departmentName,
            icon: photoUrl,
            id: department?.id || departmentName.toLowerCase().replace(/\s+/g, "-"),
        }

        console.log("Form submitted:", data)

        if (onSave) {
            onSave(data)
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-[#323232]">
                        {department ? "Edit Department" : "Add New Department"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {photoUrl ? (
                                    <Image
                                        src={photoUrl || "/placeholder.svg"}
                                        alt="Department icon"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        width="64"
                                        height="64"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-blue-600"
                                    >
                                        <path
                                            d="M12 16V12M12 12V8M12 12H16M12 12H8"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png"
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" className="text-blue-600" onClick={handlePhotoUpload}>
                                Upload Photo
                            </Button>
                            {photoUrl && (
                                <Button type="button" variant="outline" className="text-red-500" onClick={handleDeletePhoto}>
                                    Delete
                                </Button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Photo must be under 2 MB & JPEG, PNG only.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departmentName" className="text-base">
                            Department name*
                        </Label>
                        <Input
                            id="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Enter name"
                            required
                            className="h-12"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12">
                            {department ? "Update Department" : "Add Department"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
