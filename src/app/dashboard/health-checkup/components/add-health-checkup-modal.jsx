"use client"

import  React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, X, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"


export function AddHealthCheckupModal({ children, healthPackage, onSave }) {
    const fileInputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [photoUrl, setPhotoUrl] = useState(healthPackage?.image || "")
    const [selectedTests, setSelectedTests] = useState(healthPackage?.testDetails || [])
    const [testInput, setTestInput] = useState("")
    const [formData, setFormData] = useState({
        title: healthPackage?.name || "",
        name: healthPackage?.name || "",
        originalPrice: healthPackage?.originalPrice?.replace("₹", "") || "",
        discountPrice: healthPackage?.discountPrice?.replace("₹", "") || "",
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            ...formData,
            photoUrl,
            tests: selectedTests.length,
            testDetails: selectedTests,
            originalPrice: `₹${formData.originalPrice}`,
            discountPrice: `₹${formData.discountPrice}`,
        }

        console.log("Form submitted:", data)

        if (onSave) {
            onSave(data)
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center">
                        <button onClick={() => setOpen(false)} className="mr-2">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <DialogTitle className={`text-[#4B4B4B] text-base`}>{healthPackage ? "Edit Health checkup" : "Add New Health checkup"}</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-0">
                    <div className="border border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center relative">
                        {photoUrl ? (
                            <div className="relative w-full h-40">
                                <Image
                                    src={photoUrl || "/placeholder.svg"}
                                    alt="Health checkup"
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                    onClick={handleDeletePhoto}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                    <Upload className="h-7 w-7 text-[#BBB9B9] mb-2" />
                                    <p className="text-base text-[#2D292D] mb-1">Upload Image</p>
                                    <p className="text-sm text-[#7F7F7F] mb-2">Photo must be under 2 MB & JPEG, PNG only.</p>
                                <Button type="button" variant="outline" onClick={handlePhotoUpload}>
                                    Choose File
                                </Button>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png"
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="title">Checkup Title*</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Checkup Name*</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="originalPrice">Original Price*</Label>
                                <Input
                                    id="originalPrice"
                                    name="originalPrice"
                                    placeholder="Original Price"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discountPrice">Discount Price*</Label>
                                <Input
                                    id="discountPrice"
                                    name="discountPrice"
                                    placeholder="Discount Price"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tests">Enter Tests*</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tests"
                                    placeholder="Tests"
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                />
                                <Button type="button" onClick={handleAddTest} className="shrink-0">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {selectedTests.map((test, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                                    {test}
                                    <button type="button" onClick={() => handleRemoveTest(test)}>
                                        <X className="h-3 w-3 ml-1" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            {healthPackage ? "Update Health checkup" : "Add Health checkup"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
