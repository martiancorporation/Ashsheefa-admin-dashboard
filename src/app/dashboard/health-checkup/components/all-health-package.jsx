"use client"

import { useState } from "react"
import Image from "next/image"
import { Ellipsis, Eye, Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HealthCheckupDetailsModal } from "./health-checkup-details-modal"
import { AddHealthCheckupModal } from "./add-health-checkup-modal"

export default function AllHealthPackage({
    searchQuery = "",
    selectedCategory = "",
    selectedGender = "",
}) {
    const [selectedPackage, setSelectedPackage] = useState(null)

    const packages = [
        {
            id: 1,
            name: "Basic Health Package-Male",
            category: "General Health",
            gender: "male",
            tests: 21,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general.png",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
                "COMPLETE BLOOD COUNT",
                "LIPID PROFILE",
                "LIVER FUNCTION TEST",
                "KIDNEY FUNCTION TEST",
                "THYROID PROFILE",
                "URINE ROUTINE",
                "CHEST X-RAY",
                "ECG",
                "VITAMIN B12",
                "VITAMIN D",
                "HBA1C",
                "CALCIUM",
                "URIC ACID",
                "ELECTROLYTES",
                "IRON STUDIES",
                "PSA (FOR MEN)",
            ],
        },
        {
            id: 2,
            name: "Basic Health Package-Female",
            category: "General Health",
            gender: "female",
            tests: 23,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_one.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
                "COMPLETE BLOOD COUNT",
                "LIPID PROFILE",
                "LIVER FUNCTION TEST",
                "KIDNEY FUNCTION TEST",
                "THYROID PROFILE",
                "URINE ROUTINE",
                "CHEST X-RAY",
                "ECG",
                "VITAMIN B12",
                "VITAMIN D",
                "HBA1C",
                "CALCIUM",
                "URIC ACID",
                "ELECTROLYTES",
                "IRON STUDIES",
                "PAP SMEAR (FOR WOMEN)",
                "MAMMOGRAM (FOR WOMEN)",
                "BONE DENSITY SCAN",
            ],
        },
        {
            id: 3,
            name: "Comprehensive Health check",
            category: "General Health",
            gender: "all",
            tests: 30,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_two.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 4,
            name: "Hypertension Screening Package",
            category: "General Health",
            gender: "all",
            tests: 15,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_three.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 5,
            name: "Healthy Heart",
            category: "Heart",
            gender: "all",
            tests: 18,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/women.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 6,
            name: "Lung Health Check",
            category: "Special",
            gender: "all",
            tests: 12,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_one.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 7,
            name: "Preconception Health Check",
            category: "Women",
            gender: "female",
            tests: 25,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_two.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 8,
            name: "Fertility Health Check",
            category: "Special",
            gender: "all",
            tests: 20,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_three.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 9,
            name: "Senior Citizen Health Check",
            category: "Senior Citizen",
            gender: "all",
            tests: 35,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general_one.webp",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 10,
            name: "Basic Health Check",
            category: "General Health",
            gender: "all",
            tests: 18,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general.png",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 11,
            name: "Menopausal Health Package",
            category: "Women",
            gender: "female",
            tests: 22,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general.png",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
        {
            id: 12,
            name: "PCOS Health Check Package",
            category: "Women",
            gender: "female",
            tests: 24,
            originalPrice: "₹5700",
            discountPrice: "₹5700",
            image: "/assets/images/healthCheckup/general.png",
            testDetails: [
                "BLOOD UREA NITROGEN, SERUM (1079H-SRL)",
                "GLUCOSE, FASTING, PLASMA / URINE (1302H-SRL)",
                "WHOLE ABDOMEN ULTRASOUND",
                "CREATININE EGFR- EPI (1320HGFREP - SRL)",
                "URINALYSIS (5200U-SRL)",
            ],
        },
    ]

    // Filter packages based on search query, category, and gender
    const filteredPackages = packages.filter((pkg) => {
        const matchesSearch =
            pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory
            ? selectedCategory === "all-categories"
                ? true
                : pkg.category.toLowerCase() === selectedCategory.replace("-", " ")
            : true

        const matchesGender = selectedGender ? (selectedGender === "all" ? true : pkg.gender === selectedGender) : true

        return matchesSearch && matchesCategory && matchesGender
    })

    // Group packages by category
    const groupedPackages = {}

    filteredPackages.forEach((pkg) => {
        if (!groupedPackages[pkg.category]) {
            groupedPackages[pkg.category] = []
        }
        groupedPackages[pkg.category].push(pkg)
    })

    const handleDeletePackage = (id) => {
        console.log("Delete package with ID:", id)
        // Here you would delete the package from your state or database
    }

    return (
        <div className="space-y-8">
            {Object.entries(groupedPackages).map(([category, packages]) => (
                <div key={category} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-medium text-[#4B4B4B]">{category}</h2>
                        <div className="flex-grow h-[1px] bg-[#DDDDDD]"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {packages.map((pkg) => (
                            <Card
                                key={pkg.id}
                                className="py-1.5 px-1.5 border border-[#EEEEEE] bg-[#FEFEFE] shadow-none overflow-hidden rounded-[10px] gap-2"
                            >
                                <div className="relative h-32 w-full">
                                    <Image src={pkg.image || "/placeholder.svg"} alt={pkg.name} fill className="w-full h-full rounded-[6px] object-cover" />
                                </div>

                                <div className="px-2 space-y-2">
                                    <div className="flex items-center justify-between ">
                                        <div className="bg-[#E3F8BC] text-[#323232] text-xs px-2 py-1 rounded-[3px]">{pkg.category}</div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Ellipsis className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <HealthCheckupDetailsModal healthPackage={pkg}>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </HealthCheckupDetailsModal>

                                                <AddHealthCheckupModal healthPackage={pkg}>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Edit Package
                                                    </DropdownMenuItem>
                                                </AddHealthCheckupModal>

                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePackage(pkg.id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Package
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex items-start gap-2 ">
                                        <div className="w-[3px] h-10 bg-[#3B8BF4] "></div>
                                        <div>
                                            <h3 className=" text-sm font-medium text-[#323232]">{pkg.name}</h3>
                                            <p className="text-sm text-[#7F7F7F]">{pkg.tests} tests included</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-[#ECECEC]">
                                        <div>
                                            <p className="text-xs text-[#7F7F7F]">Discounted Pricing</p>
                                            <p className="font-semibold text-lg text-[#323232]">{pkg.discountPrice}</p>
                                        </div>


                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
