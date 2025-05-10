"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EditDetailsForm() {
    const [formData, setFormData] = useState({
        firstName: "Farukuddin",
        lastName: "Purkaite",
        contactNumber: "+91 2355658454",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log("Form submitted:", formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 ">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className={`text-[#4A4A4B] text-sm`}>First name*</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" className={`text-[#4A4A4B] text-sm`}>Last name*</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <Label htmlFor="contactNumber" className={`text-[#4A4A4B] text-sm`}>Contact Number</Label>
                <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" className={`border-none bg-transparent shadow-none`}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-[#005CD4] text-sm  hover:bg-blue-700 rounded-[6px] font-normal border-transparent px-8">
                    Save Details
                </Button>
            </div>
        </form>
    )
}
