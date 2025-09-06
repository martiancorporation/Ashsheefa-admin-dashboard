"use client"

import React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export function AddDoctorModal({ open, onOpenChange, doctor, onSave, departments = [], departmentsLoading = false }) {
    const fileInputRef = useRef(null)
    const [photoUrl, setPhotoUrl] = useState(doctor?.profilePic || "")
    const [selectedLanguages, setSelectedLanguages] = useState(doctor?.languages || [])
    const [validationError, setValidationError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showAvailability, setShowAvailability] = useState(false)
    const [schedule, setSchedule] = useState({
        monday: { enabled: doctor?.availability?.some(a => a.day === "Monday") || false, startTime: "09:00", endTime: "17:00" },
        tuesday: { enabled: doctor?.availability?.some(a => a.day === "Tuesday") || false, endTime: "17:00" },
        wednesday: { enabled: doctor?.availability?.some(a => a.day === "Wednesday") || false, startTime: "09:00", endTime: "17:00" },
        thursday: { enabled: doctor?.availability?.some(a => a.day === "Thursday") || false, startTime: "09:00", endTime: "17:00" },
        friday: { enabled: doctor?.availability?.some(a => a.day === "Friday") || false, startTime: "09:00", endTime: "17:00" },
        saturday: { enabled: doctor?.availability?.some(a => a.day === "Saturday") || false, startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: doctor?.availability?.some(a => a.day === "Sunday") || false, startTime: "09:00", endTime: "17:00" },
    })
    const [formData, setFormData] = useState({
        fullName: doctor?.fullName || "",
        department: doctor?.department || "",
        regNo: doctor?.regNo || "",
        experience: doctor?.experience || "",
        contactNumber: doctor?.contactNumber || "",
        qualification: doctor?.qualification || "",
        bio: doctor?.bio || "",
        email: doctor?.email || "",
        specialization: doctor?.specialization || "",
        isActive: doctor?.isActive ?? true,
        availability: doctor?.availability || []
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePhotoUpload = () => {
        console.log("Upload photo clicked")
        if (fileInputRef.current) {
            fileInputRef.current.click()
        } else {
            console.error("File input ref is not available")
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        console.log("File selected:", file)

        if (file) {
            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert("File size must be under 2 MB")
                return
            }

            // Validate file type
            if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
                alert("Please select a JPEG or PNG image")
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    console.log("File loaded successfully")
                    setPhotoUrl(event.target.result)
                }
            }
            reader.onerror = () => {
                console.error("Error reading file")
                alert("Error reading file. Please try again.")
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

    const timeOptions = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
    ]

    const handleToggleDay = (day) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled,
            },
        }))
    }

    const handleTimeChange = (day, type, value) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value,
            },
        }))
    }

    const toggleAvailability = () => {
        setShowAvailability(!showAvailability)
    }

    // Initialize schedule when editing a doctor
    React.useEffect(() => {
        if (doctor?.availability && doctor.availability.length > 0) {
            const newSchedule = { ...schedule }
            doctor.availability.forEach(avail => {
                const dayKey = avail.day.toLowerCase()
                if (newSchedule[dayKey]) {
                    newSchedule[dayKey] = {
                        enabled: true,
                        startTime: avail.startTime,
                        endTime: avail.endTime
                    }
                }
            })
            setSchedule(newSchedule)
            setShowAvailability(true) // Show availability section if there's existing data
        }
    }, [doctor])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidationError("")
        setIsSubmitting(true)

        // Validate required fields
        const { fullName, department, regNo, isActive } = formData
        let validateError = ""

        if (!fullName || !department || !regNo || isActive === undefined) {
            validateError = "Full Name, Department, Registration Number, and Active status are required."
        }

        if (validateError) {
            setValidationError(validateError)
            setIsSubmitting(false)
            return
        }

        try {
            // Process availability data
            const availability = Object.entries(schedule)
                .filter(([_, value]) => value.enabled)
                .map(([day, value]) => ({
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    startTime: value.startTime,
                    endTime: value.endTime
                }))

            // Handle form submission
            const formattedData = {
                ...formData,
                profilePic: photoUrl,
                languages: selectedLanguages,
                _id: doctor?._id, // Include _id if editing
                availability: availability
            }
            console.log("Form submitted:", formattedData)
            if (onSave) {
                await onSave(formattedData)
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            setValidationError("An error occurred while saving. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 bg-[#ffffff]">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle>{doctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors">
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
                                accept="image/jpeg, image/png, image/jpg"
                                className="hidden"
                            />
                        </div>
                        <div className="ml-4">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={handlePhotoUpload}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    Upload Photo
                                </button>
                                {photoUrl && (
                                    <button
                                        type="button"
                                        onClick={handleDeletePhoto}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isSubmitting}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Photo must be under 2 MB & JPEG, PNG only.</p>
                            <p className="text-xs text-gray-400 mt-1">Click "Upload Photo" to select an image file</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name*</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input
                            id="qualification"
                            name="qualification"
                            placeholder="Enter qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department*</Label>
                        <Select
                            value={formData.department}
                            onValueChange={(value) => handleSelectChange("department", value)}
                            disabled={departmentsLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select department"} />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
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
                            <Label htmlFor="experience">Experience</Label>
                            <Input
                                id="experience"
                                name="experience"
                                placeholder="Experience"
                                value={formData.experience}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact number</Label>
                        <Input
                            id="contactNumber"
                            name="contactNumber"
                            placeholder="Enter number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                            id="specialization"
                            name="specialization"
                            placeholder="Enter specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="isActive" className="text-base">Active Status</Label>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            name="bio"
                            placeholder="Enter doctor's bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Select language</Label>
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

                    <div className="bg-blue-50 rounded-md p-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors" onClick={toggleAvailability}>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-600 font-medium">Manage Availability</span>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-blue-600 transition-transform ${showAvailability ? 'rotate-90' : ''}`} />
                    </div>

                    {showAvailability && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
                            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                            {Object.entries(schedule).map(([day, { enabled, startTime, endTime }]) => (
                                <div key={day} className="border-b pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label htmlFor={`${day}-toggle`} className="text-base capitalize font-medium">
                                            {day}
                                        </Label>
                                        <Switch
                                            id={`${day}-toggle`}
                                            checked={enabled}
                                            onCheckedChange={() => handleToggleDay(day)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>

                                    {enabled ? (
                                        <div className="flex items-center gap-2">
                                            <Select value={startTime} onValueChange={(value) => handleTimeChange(day, "startTime", value)}>
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeOptions.map((time) => (
                                                        <SelectItem key={`${day}-start-${time}`} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <span className="text-gray-500">to</span>

                                            <Select value={endTime} onValueChange={(value) => handleTimeChange(day, "endTime", value)}>
                                                <SelectTrigger className="w-[140px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeOptions.map((time) => (
                                                        <SelectItem key={`${day}-end-${time}`} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Not working on this day</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {validationError && (
                        <div className="text-red-500 text-sm mt-4">{validationError}</div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {doctor ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                doctor ? "Update Doctor" : "Add Doctor"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
