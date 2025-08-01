"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, X, Upload, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import healthCheckup from "@/api/healthCheckup"

export function AddHealthCheckupModal({ open, onOpenChange, healthPackage, onSave }) {
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [photoUrl, setPhotoUrl] = useState("")
    const [selectedTests, setSelectedTests] = useState([])
    const [testInput, setTestInput] = useState("")
    const [formData, setFormData] = useState({
        checkup_title: "",
        checkup_name: "",
        original_price: "",
        discount_price: "",
        description: "",
    })

    // Initialize form when modal opens or healthPackage changes
    useEffect(() => {
        if (open) {
            if (healthPackage) {
                setFormData({
                    checkup_title: healthPackage.checkup_title || "",
                    checkup_name: healthPackage.checkup_name || "",
                    original_price: healthPackage.original_price?.toString() || "",
                    discount_price: healthPackage.discount_price?.toString() || "",
                    description: healthPackage.description || "",
                })
                setPhotoUrl(healthPackage.image || "")
                setSelectedTests(healthPackage.tests || [])
            } else {
                // Reset form for new health checkup
                setFormData({
                    checkup_title: "",
                    checkup_name: "",
                    original_price: "",
                    discount_price: "",
                    description: "",
                })
                setPhotoUrl("")
                setSelectedTests([])
            }
            setTestInput("")
        }
    }, [open, healthPackage])

    const handleChange = (e) => {
        const { name, value } = e.target
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

    const handleAddTest = () => {
        if (testInput.trim() && !selectedTests.includes(testInput.trim())) {
            setSelectedTests([...selectedTests, testInput.trim()])
            setTestInput("")
        }
    }

    const handleRemoveTest = (test) => {
        setSelectedTests(selectedTests.filter((t) => t !== test))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.checkup_title.trim()) {
            toast.error("Checkup title is required")
            return
        }
        if (!formData.checkup_name.trim()) {
            toast.error("Checkup name is required")
            return
        }
        if (!formData.original_price.trim()) {
            toast.error("Original price is required")
            return
        }
        if (!formData.discount_price.trim()) {
            toast.error("Discount price is required")
            return
        }
        if (selectedTests.length === 0) {
            toast.error("At least one test is required")
            return
        }

        setLoading(true)
        try {
            const submitData = {
                checkup_title: formData.checkup_title.trim(),
                checkup_name: formData.checkup_name.trim(),
                original_price: formData.original_price.trim(),
                discount_price: formData.discount_price.trim(),
                image: photoUrl || null,
                tests: selectedTests,
                description: formData.description.trim() || null,
            }

            let response
            if (healthPackage) {
                // Update existing health checkup
                response = await healthCheckup.updateHealthCheckup(healthPackage._id, submitData)
                if (response) {
                    toast.success("Health checkup updated successfully")
                } else {
                    toast.error("Failed to update health checkup")
                }
            } else {
                // Create new health checkup
                response = await healthCheckup.addHealthCheckup(submitData)
                if (response) {
                    toast.success("Health checkup created successfully")
                } else {
                    toast.error("Failed to create health checkup")
                }
            }

            if (response) {
                onOpenChange(false)
                if (onSave) {
                    onSave()
                }
            }
        } catch (error) {
            console.error("Error saving health checkup:", error)
            toast.error("An error occurred while saving the health checkup")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={handleCancel} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className={`text-[#4B4B4B] text-base`}>
                            {healthPackage ? "Edit Health checkup" : "Add New Health checkup"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Checkup Title */}
                    <div className="space-y-2">
                        <Label htmlFor="checkup_title" className="text-[#4A4A4B] text-sm">
                            Checkup Title*
                        </Label>
                        <Input
                            id="checkup_title"
                            name="checkup_title"
                            value={formData.checkup_title}
                            onChange={handleChange}
                            placeholder="e.g., Pre-Surgery"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Checkup Name */}
                    <div className="space-y-2">
                        <Label htmlFor="checkup_name" className="text-[#4A4A4B] text-sm">
                            Checkup Name*
                        </Label>
                        <Input
                            id="checkup_name"
                            name="checkup_name"
                            value={formData.checkup_name}
                            onChange={handleChange}
                            placeholder="e.g., Pre-Anesthesia package"
                            required
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="original_price" className="text-[#4A4A4B] text-sm">
                                Original Price*
                            </Label>
                            <Input
                                id="original_price"
                                name="original_price"
                                type="number"
                                value={formData.original_price}
                                onChange={handleChange}
                                placeholder="10000"
                                required
                                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount_price" className="text-[#4A4A4B] text-sm">
                                Discount Price*
                            </Label>
                            <Input
                                id="discount_price"
                                name="discount_price"
                                type="number"
                                value={formData.discount_price}
                                onChange={handleChange}
                                placeholder="6000"
                                required
                                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[#4A4A4B] text-sm">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description (optional)"
                            className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label className="text-[#4A4A4B] text-sm">Photo</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePhotoUpload}
                                className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Photo
                            </Button>
                            {photoUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDeletePhoto}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {photoUrl && (
                            <div className="mt-2">
                                <Image
                                    src={photoUrl}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tests */}
                    <div className="space-y-2">
                        <Label className="text-[#4A4A4B] text-sm">Tests*</Label>
                        <div className="flex gap-2">
                            <Input
                                value={testInput}
                                onChange={(e) => setTestInput(e.target.value)}
                                placeholder="Add test name"
                                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                                disabled={loading}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddTest()
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={handleAddTest}
                                className="bg-[#005CD4] hover:bg-blue-700"
                                disabled={loading}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {selectedTests.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTests.map((test, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    >
                                        {test}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTest(test)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                            disabled={loading}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#005CD4] hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {healthPackage ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                healthPackage ? "Update Health Checkup" : "Create Health Checkup"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
