"use client"

import  React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function AddDoctorModal({ children, doctor, onSave }) {
    const fileInputRef = useRef(null)
    const [photoUrl, setPhotoUrl] = useState(doctor?.photoUrl || "")
    const [selectedLanguages, setSelectedLanguages] = useState(doctor?.languages || [])
    const [formData, setFormData] = useState({
        firstName: doctor?.name?.split(" ")[1] || "",
        lastName: doctor?.name?.split(" ")[2] || "",
        department: doctor?.department || "",
        regNo: doctor?.regNo?.replace("Reg. No. ", "").replace("Reg No. ", "") || "",
        experience: doctor?.experience?.replace("+", "") || "",
        contactNumber: doctor?.contactNumber || "",
    })
    const [open, setOpen] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

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

    const toggleLanguage = (language) => {
        if (selectedLanguages.includes(language)) {
            setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
        } else {
            setSelectedLanguages([...selectedLanguages, language])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        const formattedData = { ...formData, photoUrl, languages: selectedLanguages }
        console.log("Form submitted:", formattedData)
        if (onSave) {
            onSave(formattedData)
        }
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center">
                        <button onClick={() => setOpen(false)} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {photoUrl ? (
                                    <Image
                                        src={photoUrl || "/placeholder.svg"}
                                        alt="Doctor photo"
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png"
                                className="hidden"
                            />
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={handlePhotoUpload} className="text-blue-600 font-medium">
                                    Upload Photo
                                </button>
                                {photoUrl && (
                                    <button type="button" onClick={handleDeletePhoto} className="text-red-500 font-medium">
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Photo must be under 2 MB & JPEG, PNG only.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name*</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Enter name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name*</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Enter name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department*</Label>
                        <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                                <SelectItem value="Anesthesiology">Anesthesiology</SelectItem>
                                <SelectItem value="Neurology">Neurology</SelectItem>
                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="regNo">Reg No.*</Label>
                            <Input
                                id="regNo"
                                name="regNo"
                                placeholder="Reg No."
                                value={formData.regNo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience*</Label>
                            <Input
                                id="experience"
                                name="experience"
                                placeholder="Experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact number*</Label>
                        <Input
                            id="contactNumber"
                            name="contactNumber"
                            placeholder="Enter number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Select language*</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="english" onClick={() => toggleLanguage("English")}>
                                    English
                                </SelectItem>
                                <SelectItem value="hindi" onClick={() => toggleLanguage("Hindi")}>
                                    Hindi
                                </SelectItem>
                                <SelectItem value="bengali" onClick={() => toggleLanguage("Bengali")}>
                                    Bengali
                                </SelectItem>
                                <SelectItem value="tamil" onClick={() => toggleLanguage("Tamil")}>
                                    Tamil
                                </SelectItem>
                                <SelectItem value="telugu" onClick={() => toggleLanguage("Telugu")}>
                                    Telugu
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedLanguages.map((language) => (
                                <Badge key={language} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                                    {language}
                                    <button type="button" onClick={() => toggleLanguage(language)}>
                                        <X className="h-3 w-3 ml-1" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-600 font-medium">Manage Availability</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-600" />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {doctor ? "Update Doctor" : "Add Doctor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
