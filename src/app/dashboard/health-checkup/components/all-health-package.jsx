"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Ellipsis, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HealthCheckupDetailsModal } from "./health-checkup-details-modal"
import { AddHealthCheckupModal } from "./add-health-checkup-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { toast } from "sonner"
import healthCheckup from "@/api/healthCheckup"

export default function AllHealthPackage({
    searchQuery = "",
    selectedCategory = "",
    onPackageUpdate,
}) {
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [openDropdownId, setOpenDropdownId] = useState(null)
    const [packageToDelete, setPackageToDelete] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingPackage, setEditingPackage] = useState(null)
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        limit: 10
    })

    // Fetch health checkups from API
    const fetchHealthCheckups = async () => {
        setLoading(true)
        try {
            const params = {
                page: 1,
                limit: 50,
                search: searchQuery,
                category: selectedCategory,
            }

            const response = await healthCheckup.getAllHealthCheckups(params)

            if (response && response.data && response.data.health_checkups) {
                setPackages(response.data.health_checkups)
                setPagination(response.data.pagination || {
                    current_page: 1,
                    total_pages: 1,
                    total_records: response.data.health_checkups.length,
                    limit: 50
                })
            } else {
                setPackages([])
                setPagination({
                    current_page: 1,
                    total_pages: 1,
                    total_records: 0,
                    limit: 50
                })
            }
        } catch (error) {
            console.error("Error fetching health checkups:", error)
            toast.error("Failed to fetch health checkups")
            setPackages([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on component mount and when filters change
    useEffect(() => {
        fetchHealthCheckups()
    }, [searchQuery, selectedCategory])

    // Handle package refresh after add/edit/delete
    const handlePackageUpdate = () => {
        if (onPackageUpdate) {
            onPackageUpdate()
        } else {
            fetchHealthCheckups()
        }
    }

    const handleViewPackage = (pkg) => {
        setSelectedPackage(pkg)
        setOpenDropdownId(null) // Close dropdown when view details is clicked
    }

    const handleEditPackage = (pkg) => {
        setEditingPackage(pkg)
        setEditModalOpen(true)
        setOpenDropdownId(null) // Close dropdown when edit is clicked
    }

    const handleDeletePackage = (pkg) => {
        setPackageToDelete(pkg)
        setOpenDropdownId(null) // Close dropdown when delete is clicked
    }

    const handleDeleteSuccess = () => {
        fetchHealthCheckups() // Refresh the list
        setPackageToDelete(null)
    }

    // Filter packages based on search and category
    const filteredPackages = packages.filter((pkg) => {
        const matchesSearch = searchQuery
            ? pkg.checkup_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.checkup_title?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        const matchesCategory = selectedCategory
            ? pkg.category?.toLowerCase() === selectedCategory.toLowerCase()
            : true

        return matchesSearch && matchesCategory
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading health checkups...</span>
            </div>
        )
    }

    if (filteredPackages.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                    {loading ? "Loading..." : "No health checkups found"}
                </div>
                {!loading && (
                    <p className="text-gray-400">
                        {searchQuery || selectedCategory
                            ? "Try adjusting your search criteria"
                            : "No health checkups available yet"}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPackages.map((pkg) => (
                <Card key={pkg._id} className="py-1.5 px-1.5 border border-[#EEEEEE] bg-[#FEFEFE] shadow-none overflow-hidden rounded-[10px] gap-2 cursor-pointer hover:shadow-sm transition-shadow">
                    {/* Image Section */}
                    <div className="relative h-32 w-full">
                        {pkg.image ? (
                            <Image
                                src={pkg.image}
                                alt={pkg.checkup_name}
                                fill
                                className="w-full h-full rounded-[6px] object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-[6px] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-1">
                                        <span className="text-blue-600 text-lg font-bold">
                                            {pkg.checkup_name?.charAt(0) || "H"}
                                        </span>
                                    </div>
                                    <p className="text-blue-600 text-xs font-medium">Health Checkup</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category and Menu Section */}
                    <div className="px-2 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="bg-[#E3F8BC] text-[#323232] text-xs px-2 py-1 rounded-[3px] cursor-pointer hover:bg-[#D4F0A8] transition-colors">
                                {pkg.checkup_title || "General Health"}
                            </div>
                            <DropdownMenu
                                open={openDropdownId === pkg._id}
                                onOpenChange={(open) => setOpenDropdownId(open ? pkg._id : null)}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 cursor-pointer">
                                        <Ellipsis className="h-4 w-4 text-gray-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                                >
                                    <DropdownMenuItem
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleViewPackage(pkg)}
                                    >
                                        <Eye className="h-4 w-4 mr-3 text-gray-500" />
                                        View Details
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleEditPackage(pkg)}
                                    >
                                        <Pencil className="h-4 w-4 mr-3 text-gray-500" />
                                        Edit Package
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                        onClick={() => handleDeletePackage(pkg)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-3 text-red-500" />
                                        Delete Package
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Package Details with Blue Line */}
                        <div className="flex items-start gap-2 cursor-pointer" onClick={() => handleViewPackage(pkg)}>
                            <div className="w-[3px] h-10 bg-[#3B8BF4]"></div>
                            <div>
                                <h3 className="text-sm font-medium text-[#323232] hover:text-[#3B8BF4] transition-colors">
                                    {pkg.checkup_name || "Basic Health"}
                                </h3>
                                <p className="text-sm text-[#7F7F7F]">
                                    {pkg.tests?.length || 0} tests included
                                </p>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="flex justify-between items-center pt-3 border-t border-[#ECECEC] cursor-pointer" onClick={() => handleViewPackage(pkg)}>
                            <div>
                                <p className="text-xs text-[#7F7F7F]">Discounted Pricing</p>
                                <p className="font-semibold text-lg text-[#323232] hover:text-[#3B8BF4] transition-colors">
                                    ₹{pkg.discount_price || pkg.original_price}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Health Checkup Details Modal */}
            {selectedPackage && (
                <HealthCheckupDetailsModal
                    healthPackage={selectedPackage}
                    onClose={() => setSelectedPackage(null)}
                    onSave={handlePackageUpdate}
                />
            )}

            {/* Add Health Checkup Modal */}
            <AddHealthCheckupModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                healthPackage={editingPackage}
                onSave={handlePackageUpdate}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                healthPackage={packageToDelete}
                onClose={() => setPackageToDelete(null)}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </div>
    )
}
