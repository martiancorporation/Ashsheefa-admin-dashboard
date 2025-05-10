"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordUpdateForm() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            alert("New passwords do not match")
            return
        }
        // Handle form submission
        console.log("Password update submitted")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="oldPassword" className={`text-[#4A4A4B] text-sm`}>Old Password*</Label>
                    <Input
                        id="oldPassword"
                        name="oldPassword"
                        type="password"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                         className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="newPassword" className={`text-[#4A4A4B] text-sm`}>New Password*</Label>
                    <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                         className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className={`text-[#4A4A4B] text-sm`}>Confirm Password*</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Enter name"
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
                    Save Details
                </Button>
            </div>
        </form>
    )
}
