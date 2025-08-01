"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import useAuthDataStore from "@/store/authStore"
import auth from "@/api/auth"

export function EmailUpdateForm() {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Enter new email, 2: Enter OTPs
    const authData = useAuthDataStore((state) => state.authData)
    const setAuthData = useAuthDataStore((state) => state.setAuthData)

    const [formData, setFormData] = useState({
        new_email: "admin001@gmail.com",
        oldEmailOtp: "",
        newEmailOtp: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleInitiateEmailChange = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.new_email.trim()) {
            toast.error("New email is required")
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.new_email)) {
            toast.error("Please enter a valid email address")
            return
        }

        setLoading(true)
        try {
            const response = await auth.ChangeEmailInitiate({
                token: authData?.access_token,
                new_email: formData.new_email.trim(),
            })

            console.log("Initiate email change response:", response)

            if (response && response.otp) {
                toast.success("OTP sent to both email addresses")
                setStep(2)
            } else {
                toast.error("Failed to send OTP")
            }
        } catch (error) {
            console.error("Error initiating email change:", error)
            // Only show error toast if it's not already handled by handleResponse
            if (!error?.response) {
                toast.error("An error occurred while sending OTP")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyEmailChange = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.oldEmailOtp.trim()) {
            toast.error("OTP for current email is required")
            return
        }
        if (!formData.newEmailOtp.trim()) {
            toast.error("OTP for new email is required")
            return
        }

        setLoading(true)
        try {
            const response = await auth.verifyEmail({
                token: authData?.access_token,
                oldEmailOtp: formData.oldEmailOtp.trim(),
                newEmailOtp: formData.newEmailOtp.trim(),
                newEmail: formData.new_email.trim(),
            })

            console.log("Verify email change response:", response)

            if (response && response.updated) {
                toast.success("Email updated successfully")
                setStep(1)

                // Update the auth store with new email
                const updatedAuthData = {
                    ...authData,
                    email: formData.new_email.trim(),
                }
                setAuthData(updatedAuthData)

                // Reset form
                setFormData({
                    new_email: formData.new_email.trim(),
                    oldEmailOtp: "",
                    newEmailOtp: "",
                })
            } else {
                toast.error("Failed to update email")
            }
        } catch (error) {
            console.error("Error verifying email change:", error)
            // Only show error toast if it's not already handled by handleResponse
            if (!error?.response) {
                toast.error("An error occurred while updating email")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {step === 1 ? (
                <form onSubmit={handleInitiateEmailChange}>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="new_email" className={`text-[#4A4A4B] text-sm`}>Enter New Email*</Label>
                            <Input
                                id="new_email"
                                name="new_email"
                                type="email"
                                value={formData.new_email}
                                onChange={handleChange}
                                placeholder="admin001@gmail.com"
                                required
                                className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
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
                                    Sending...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerifyEmailChange}>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="oldEmailOtp" className={`text-[#4A4A4B] text-sm`}>OTP for Current email (admin001@gmail.com)*</Label>
                            <Input
                                id="oldEmailOtp"
                                name="oldEmailOtp"
                                value={formData.oldEmailOtp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                required
                                className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="newEmailOtp" className={`text-[#4A4A4B] text-sm`}>OTP for New email ({formData.new_email || "new email"})*</Label>
                            <Input
                                id="newEmailOtp"
                                name="newEmailOtp"
                                value={formData.newEmailOtp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                required
                                className={`bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none`}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
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
                                    Verifying...
                                </>
                            ) : (
                                "Confirm Email Changes"
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
