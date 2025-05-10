"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailUpdateForm() {
    const [formData, setFormData] = useState({
        newEmail: "",
        currentOtp: "",
        newOtp: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log("Email update submitted:", formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="newEmail" className={`text-[#4A4A4B] text-sm`}>Enter New Email*</Label>
                    <Input
                        id="newEmail"
                        name="newEmail"
                        type="email"
                        value={formData.newEmail}
                        onChange={handleChange}
                        placeholder="admin001@gmail.com"
                        required
                         className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="currentOtp" className={`text-[#4A4A4B] text-sm`}>OTP for Current email (admin001@gmail.com)*</Label>
                    <Input
                        id="currentOtp"
                        name="currentOtp"
                        value={formData.currentOtp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        required
                         className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="newOtp"className={`text-[#4A4A4B] text-sm`}>OTP for New email ({formData.newEmail || "new email"})*</Label>
                    <Input
                        id="newOtp"
                        name="newOtp"
                        value={formData.newOtp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        required
                         className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" className={`border-none bg-transparent shadow-none`}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-[#005CD4] text-sm  hover:bg-blue-700 rounded-[6px] font-normal border-transparent px-8">
                    Confirm Email Changes
                </Button>
            </div>
        </form>
    )
}
