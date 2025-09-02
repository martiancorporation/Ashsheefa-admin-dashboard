"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"


export function AddDepartmentModal({ department, onSave, open, onOpenChange }) {
    const fileInputRef = useRef(null)
    const [photoUrl, setPhotoUrl] = useState(department?.department_logo || department?.logo || department?.icon || "")
    const [bannerUrl, setBannerUrl] = useState(department?.image || "")
    const [departmentName, setDepartmentName] = useState(department?.name || department?.department_name || "")
    const [label, setLabel] = useState(department?.label || "")
    const [title, setTitle] = useState(department?.title || "")
    const [description, setDescription] = useState(department?.description || "")
    const [treatmentTitle, setTreatmentTitle] = useState(department?.treatment_title || "")
    const [treatmentDescription, setTreatmentDescription] = useState(department?.treatment_description || "")
    const [services, setServices] = useState(Array.isArray(department?.list_of_services) ? department?.list_of_services.join("\n") : "")
    const [isActive, setIsActive] = useState(department?.is_active ?? true)
    const [submitting, setSubmitting] = useState(false)

    // Reset form when department prop changes (for editing)
    useEffect(() => {
        if (department) {
            setPhotoUrl(department?.department_logo || department?.logo || department?.icon || "")
            setBannerUrl(department?.image || department?.banner || "")
            setDepartmentName(department?.name || department?.department_name || "")
            setLabel(department?.label || "")
            setTitle(department?.title || "")
            setDescription(department?.description || "")
            setTreatmentTitle(department?.treatment_title || "")
            setTreatmentDescription(department?.treatment_description || "")
            setServices(Array.isArray(department?.list_of_services) ? department?.list_of_services.join("\n") : "")
            setIsActive(department?.is_active ?? true)
        } else {
            setPhotoUrl("")
            setBannerUrl("")
            setDepartmentName("")
            setLabel("")
            setTitle("")
            setDescription("")
            setTreatmentTitle("")
            setTreatmentDescription("")
            setServices("")
            setIsActive(true)
        }
    }, [department])

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open && department) {
            setPhotoUrl(department?.department_logo || department?.logo || department?.icon || "")
            setBannerUrl(department?.image || department?.banner || "")
        }
    }, [open, department])

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

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setBannerUrl(event.target.result)
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
        if (!departmentName?.trim()) return
        setSubmitting(true)

        const data = {
            id: department?._id || department?.id || undefined,
            name: departmentName,
            label,
            title,
            description,
            treatment_title: treatmentTitle,
            treatment_description: treatmentDescription,
            list_of_services: services
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean),
            ...(photoUrl ? { department_logo: photoUrl, logo: photoUrl } : {}),
            ...(bannerUrl ? { image: bannerUrl, banner: bannerUrl } : {}),
            is_active: isActive,
        }



        if (onSave) {
            onSave(data)
        }

        setSubmitting(false)

        // Don't close modal here - let the parent handle it after successful API call
        // if (onOpenChange) {
        //     onOpenChange(false)
        // }
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 bg-[#ffffff]">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center">
                        <button type="button" onClick={() => onOpenChange && onOpenChange(false)} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className="text-2xl font-semibold text-[#323232]">
                            {department ? "Edit Department" : "Add New Department"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-2 px-6 pt-0 pb-4">
                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-base">Department Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
                                        {photoUrl ? (
                                            <Image src={photoUrl || "/placeholder.svg"} alt="logo" width={96} height={96} className="w-full h-full object-cover" />
                                        ) : (
                                            <svg
                                                width="32"
                                                height="32"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="text-blue-600"
                                            >
                                                <path d="M12 16V12M12 12V8M12 12H16M12 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePhotoUpload}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={submitting}
                                        >
                                            Upload
                                        </button>
                                        {photoUrl && (
                                            <button
                                                type="button"
                                                onClick={handleDeletePhoto}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={submitting}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">JPEG, PNG, WEBP, SVG, up to 2 MB.</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" className="hidden" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base">Banner Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-40 h-24 rounded bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
                                        {bannerUrl ? (
                                            <Image src={bannerUrl || "/placeholder.svg"} alt="banner" width={160} height={96} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-blue-600 text-xs">No Banner</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("bannerInput")?.click()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={submitting}
                                        >
                                            Upload
                                        </button>
                                        {bannerUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setBannerUrl("")}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={submitting}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">JPEG, PNG, WEBP, SVG, up to 2 MB.</p>
                                <input id="bannerInput" type="file" onChange={handleBannerChange} accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" className="hidden" />
                            </div>
                        </div>

                        <h3 className="text-sm font-medium text-[#4B4B4B]">Basic details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="departmentName" className="text-base">Department name<span className="text-red-500">*</span></Label>
                                <Input id="departmentName" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="Enter name" required className="h-10 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="label" className="text-base">Label</Label>
                                <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="About Neurology" className="h-10 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="title" className="text-base">Title</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is Neurology?" className="h-10 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="treatmentTitle" className="text-base">Treatment title</Label>
                                <Input id="treatmentTitle" value={treatmentTitle} onChange={(e) => setTreatmentTitle(e.target.value)} placeholder="Expert neurological care..." className="h-10 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-base">Status</Label>
                                <div className="flex items-center justify-between rounded border px-3 py-2">
                                    <span className="text-sm text-[#4B4B4B]">{isActive ? "Active" : "Inactive"}</span>
                                    <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-blue-600" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-[#4B4B4B]">Descriptions</h3>
                            <Label htmlFor="description" className="text-base">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Neurology is a branch of medicine..." className="min-h-24 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="treatmentDescription" className="text-base">Treatment description</Label>
                            <Textarea id="treatmentDescription" value={treatmentDescription} onChange={(e) => setTreatmentDescription(e.target.value)} placeholder="Our Neurology department provides comprehensive care..." className="min-h-24 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="services" className="text-base">List of services (one per line)</Label>
                            <Textarea id="services" value={services} onChange={(e) => setServices(e.target.value)} placeholder={`Electroencephalogram (EEG)\nNerve Conduction Studies\nDeep Brain Stimulation\nStroke Management`} className="min-h-24 bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none" />
                            <p className="text-xs text-[#9CA3AF]">Press Enter to add each service on a new line.</p>
                            {services?.trim() && (
                                <div className="pt-2">
                                    <p className="text-xs text-[#6B7280] mb-2">Preview</p>
                                    <div className="flex flex-wrap gap-2">
                                        {services
                                            .split(/\r?\n/)
                                            .map((s) => s.trim())
                                            .filter(Boolean)
                                            .slice(0, 20)
                                            .map((serviceItem, idx) => (
                                                <span key={idx} className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs">
                                                    {serviceItem}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange && onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting || !departmentName} className="bg-blue-600 hover:bg-blue-700">
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {department ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                department ? "Update Department" : "Create Department"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
