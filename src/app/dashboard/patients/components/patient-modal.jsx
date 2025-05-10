"use client"


import { useState } from "react"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Image from "next/image"



export function PatientModal({ isOpen, onClose, isEdit = false, patientData }) {
    const [formData, setFormData] = useState({
        firstName: patientData?.firstName || "",
        lastName: patientData?.lastName || "",
        age: patientData?.age || "",
        gender: patientData?.gender || "",
        contactNumber: patientData?.contactNumber || "",
        aadhaarNo: patientData?.aadhaarNo || "",
        address: patientData?.address || "",
        city: patientData?.city || "",
        state: patientData?.state || "",
        referralDoctor: patientData?.referralDoctor || "",
        swastaSathiCard: patientData?.swastaSathiCard || "",
        insurance: patientData?.insurance || "",
        appointmentDate: patientData?.appointmentDate || "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log("Form submitted:", formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg py-4  max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex gap-2 items-center text-[#4B4B4B]">
                        <Image
                            width={100}
                            height={100}
                            src={"/assets/images/dashboard/leftArrow.svg"}
                            alt="leftArrow"
                            className="w-4 h-4"
                        />
                        <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
                        <DialogTitle className={`text-[#4B4B4B] text-sm`}>{isEdit ? "Edit Patient" : "Add New Patient"}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
                                className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
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
                                className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Patient age*</Label>
                            <Input id="age" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender*</Label>
                            <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
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
                            className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aadhaarNo">Aadhaar no.*</Label>
                        <Input
                            id="aadhaarNo"
                            name="aadhaarNo"
                            placeholder="Aadhaar number"
                            value={formData.aadhaarNo}
                            onChange={handleChange}
                            required
                            className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address*</Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City*</Label>
                            <Select  value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent className='w-full bg-red-200'>
                                    <SelectItem value="kolkata">Kolkata</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="mumbai">Mumbai</SelectItem>
                                    <SelectItem value="chennai">Chennai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State*</Label>
                            <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="referralDoctor">Referral Doctor*</Label>
                        <Select
                            value={formData.referralDoctor}
                            onValueChange={(value) => handleSelectChange("referralDoctor", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select referral doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dr-hashim">Dr. Hashim</SelectItem>
                                <SelectItem value="dr-sen">Dr. Sen</SelectItem>
                                <SelectItem value="dr-sharma">Dr. Sharma</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="swastaSathiCard">Swasta Sathi Card*</Label>
                            <Select
                                value={formData.swastaSathiCard}
                                onValueChange={(value) => handleSelectChange("swastaSathiCard", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Swasta sathi card" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="insurance">Insurance*</Label>
                            <Select value={formData.insurance} onValueChange={(value) => handleSelectChange("insurance", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Insurance" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appointmentDate">Appointment Date*</Label>
                        <div className="relative">
                            <Input
                                id="appointmentDate"
                                name="appointmentDate"
                                type="date"
                                placeholder="Select Date"
                                value={formData.appointmentDate}
                                onChange={handleChange}
                                required
                                className="pr-10"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {isEdit ? "Update Patient" : "Add Patient"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
