"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import API from "@/api"
import { toast } from "sonner"

export function PatientModal({ isOpen, onClose, isEdit = false, patientData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: patientData?.name || "",
        phone_number: patientData?.phone_number || "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Validate required fields
            const requiredFields = ['name', 'phone_number']
            const missingFields = requiredFields.filter(field => !formData[field])

            if (missingFields.length > 0) {
                toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
                setIsSubmitting(false)
                return
            }

            const formattedData = {
                ...formData
            }

            const response = await API.patientsEnquiry.addPatientsEnquiry(formattedData)

            if (response && response.success !== false) {
                toast.success("Patient enquiry added successfully")
                onClose()
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                toast.error("Failed to add patient enquiry")
            }
        } catch (error) {
            console.error("Error adding patient enquiry:", error)
            toast.error("Error adding patient enquiry")
        } finally {
            setIsSubmitting(false)
        }
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
                        <DialogTitle className={`text-[#4B4B4B] text-sm`}>{isEdit ? "Edit Patient Enquiry" : "Add New Patient Enquiry"}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name*</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number*</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            placeholder="Enter phone number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            className={`bg-[#FBFBFB] border border-[#DDDDDD] rounded-[6px]`}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEdit ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                isEdit ? "Update Enquiry" : "Add Enquiry"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 