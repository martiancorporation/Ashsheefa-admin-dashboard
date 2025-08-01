"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import useAuthDataStore from "@/store/authStore"
import auth from "@/api/auth"

export function EditDetailsForm() {
    const [loading, setLoading] = useState(false)
    const authData = useAuthDataStore((state) => state.authData)
    const setAuthData = useAuthDataStore((state) => state.setAuthData)

    const [formData, setFormData] = useState({
        first_name: "Farukuddin",
        last_name: "Purkaite",
        phone_number: "+91 2355658454",
    })

    // Initialize form with current user data
    useEffect(() => {
        if (authData) {
            setFormData({
                first_name: authData.first_name || "Farukuddin",
                last_name: authData.last_name || "Purkaite",
                phone_number: authData.phone_number || "+91 2355658454",
            })
        }
    }, [authData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.first_name.trim()) {
            toast.error("First name is required")
            return
        }
        if (!formData.last_name.trim()) {
            toast.error("Last name is required")
            return
        }
        if (!formData.phone_number.trim()) {
            toast.error("Phone number is required")
            return
        }

        setLoading(true)
        try {
            const response = await auth.UpdateAdminDetails({
                token: authData?.access_token,
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                phone_number: formData.phone_number.trim(),
            })

            console.log("Update admin details response:", response)

            // Check if response exists and has user data (successful update)
            if (response && response.user) {
                toast.success("Admin details updated successfully")

                // Update the auth store with new data
                const updatedAuthData = {
                    ...authData,
                    first_name: response.user.first_name,
                    last_name: response.user.last_name,
                    phone_number: response.user.phone_number,
                }
                setAuthData(updatedAuthData)

                // Update local form data to reflect changes
                setFormData({
                    first_name: response.user.first_name,
                    last_name: response.user.last_name,
                    phone_number: response.user.phone_number,
                })
            } else if (response && response.message) {
                // If response has message but no user data, it might still be successful
                toast.success(response.message)
            } else {
                // If no response or no user data, it's an error
                toast.error("Failed to update admin details")
            }
        } catch (error) {
            console.error("Error updating admin details:", error)
            // Only show error toast if it's not already handled by handleResponse
            if (!error?.response) {
                toast.error("An error occurred while updating details")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name" className={`text-[#4A4A4B] text-sm`}>First name*</Label>
                    <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name" className={`text-[#4A4A4B] text-sm`}>Last name*</Label>
                    <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                        className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="space-y-2 mb-6">
                <Label htmlFor="phone_number" className={`text-[#4A4A4B] text-sm`}>Contact Number</Label>
                <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                    disabled={loading}
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className={`border-none bg-transparent shadow-none`}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#005CD4] text-sm hover:bg-blue-700 rounded-[6px] font-normal border-transparent px-8"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Details"
                    )}
                </Button>
            </div>
        </form>
    )
}
