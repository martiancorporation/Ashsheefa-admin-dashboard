"use client"

import { useState, useEffect } from "react"
import { Ellipsis, Eye, Pencil, Trash2, Loader2, Calendar, Phone, MapPin, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { InternationalPatientDetailsModal } from "./international-patient-details-modal"
import { AddInternationalPatientModal } from "./add-international-patient-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { UpdateStatusModal } from "./update-status-modal"
import { toast } from "sonner"
import internationalPatient from "@/api/internationalPatient"

export default function AllInternationalPatients({
    searchQuery = "",
    selectedStatus = "",
    selectedSpeciality = "",
    selectedCountry = "",
    onPatientUpdate,
    departments = [],
    departmentsLoading = false,
}) {
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [openDropdownId, setOpenDropdownId] = useState(null)
    const [patientToDelete, setPatientToDelete] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingPatient, setEditingPatient] = useState(null)
    const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false)
    const [statusUpdatePatient, setStatusUpdatePatient] = useState(null)
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        limit: 10
    })

    // Fetch international patients from API
    const fetchInternationalPatients = async () => {
        setLoading(true)
        try {
            // Convert filter values back to original format for API
            const statusParam = selectedStatus && selectedStatus !== 'all-status' ? selectedStatus.replace(/-/g, ' ') : ''
            const specialityParam = selectedSpeciality && selectedSpeciality !== 'all-specialities' ? selectedSpeciality.replace(/-/g, ' ') : ''
            const countryParam = selectedCountry && selectedCountry !== 'all-countries' ? selectedCountry.replace(/-/g, ' ') : ''

            console.log('API Filter Parameters:', {
                status: statusParam,
                speciality: specialityParam,
                country: countryParam,
                search: searchQuery
            })

            const params = {
                page: 1,
                limit: 50,
                search: searchQuery,
                status: statusParam,
                speciality: specialityParam,
                country: countryParam,
            }

            const response = await internationalPatient.getAllInternationalPatients(params)

            console.log('API Response:', response)

            // Check if the data is directly in response.data or nested
            let patientsData = null
            let paginationData = null

            if (response.data && response.data.international_patients) {
                // Direct structure: response.data.international_patients
                patientsData = response.data.international_patients
                paginationData = response.data.pagination
            } else if (response.data && response.data.data && response.data.data.international_patients) {
                // Nested structure: response.data.data.international_patients
                patientsData = response.data.data.international_patients
                paginationData = response.data.data.pagination
            } else if (response.data && Array.isArray(response.data)) {
                // Direct array structure
                patientsData = response.data
                paginationData = null
            }

            if (patientsData) {
                console.log('=== PATIENTS DATA LOADED ===')
                console.log('First 3 patients data:', patientsData.slice(0, 3).map(p => ({
                    name: p.patient_full_name,
                    status: p.status,
                    speciality: p.speciality,
                    country: p.country
                })))
                console.log('=== END PATIENTS DATA ===')

                setPatients(patientsData)
                setPagination(paginationData || {
                    current_page: 1,
                    total_pages: 1,
                    total_records: patientsData.length,
                    limit: 50
                })
            } else {
                setPatients([])
                setPagination({
                    current_page: 1,
                    total_pages: 1,
                    total_records: 0,
                    limit: 50
                })
            }
        } catch (error) {
            console.error("Error fetching international patients:", error)
            toast.error("Failed to fetch international patients")
            setPatients([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on component mount and when filters change
    useEffect(() => {
        console.log('Filter values changed:', {
            searchQuery,
            selectedStatus,
            selectedSpeciality,
            selectedCountry
        })
        fetchInternationalPatients()
    }, [searchQuery, selectedStatus, selectedSpeciality, selectedCountry])



    // Handle patient refresh after add/edit/delete
    const handlePatientUpdate = () => {
        if (onPatientUpdate) {
            onPatientUpdate()
        } else {
            fetchInternationalPatients()
        }
    }

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient)
        setOpenDropdownId(null) // Close dropdown when view details is clicked
    }

    const handleEditPatient = (patient) => {
        setEditingPatient(patient)
        setEditModalOpen(true)
        setOpenDropdownId(null) // Close dropdown when edit is clicked
    }

    const handleUpdateStatus = (patient) => {
        setStatusUpdatePatient(patient)
        setStatusUpdateModalOpen(true)
        setOpenDropdownId(null) // Close dropdown when update status is clicked
    }

    const handleDeletePatient = (patient) => {
        setPatientToDelete(patient)
        setOpenDropdownId(null) // Close dropdown when delete is clicked
    }

    const handleDeleteSuccess = () => {
        fetchInternationalPatients() // Refresh the list
        setPatientToDelete(null)
    }

    // Filter patients based on search and filters
    const filteredPatients = patients.filter((patient) => {
        // Show all patients if no filters are applied
        if (!searchQuery && !selectedStatus && !selectedSpeciality && !selectedCountry) {
            return true
        }

        // Search filter
        const matchesSearch = searchQuery
            ? patient.patient_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.passport_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.contact_number?.includes(searchQuery) ||
            patient.country?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        // Status filter - convert filter value back to original format
        const statusFilter = selectedStatus && selectedStatus !== 'all-status'
            ? selectedStatus.replace(/-/g, ' ').toLowerCase()
            : ''

        const matchesStatus = statusFilter
            ? patient.status?.toLowerCase() === statusFilter
            : true

        // Speciality filter
        const specialityFilter = selectedSpeciality && selectedSpeciality !== 'all-specialities'
            ? selectedSpeciality.replace(/-/g, ' ').toLowerCase()
            : ''

        const matchesSpeciality = specialityFilter
            ? patient.speciality?.toLowerCase() === specialityFilter
            : true

        // Country filter
        const countryFilter = selectedCountry && selectedCountry !== 'all-countries'
            ? selectedCountry.replace(/-/g, ' ').toLowerCase()
            : ''

        const matchesCountry = countryFilter
            ? patient.country?.toLowerCase() === countryFilter
            : true

        // Debug logging for first patient only to avoid spam
        if ((selectedStatus || selectedSpeciality || selectedCountry) && patients.indexOf(patient) === 0) {
            console.log('=== FILTER DEBUG ===')
            console.log('Available patients data:', patients.map(p => ({
                name: p.patient_full_name,
                status: p.status,
                speciality: p.speciality,
                country: p.country
            })))
            console.log('Current filter values:', {
                selectedStatus,
                statusFilter,
                selectedSpeciality,
                specialityFilter,
                selectedCountry,
                countryFilter
            })
            console.log('Current patient being filtered:', {
                name: patient.patient_full_name,
                status: patient.status,
                speciality: patient.speciality,
                country: patient.country
            })
            console.log('Matches:', {
                matchesStatus,
                matchesSpeciality,
                matchesCountry
            })
            console.log('=== END DEBUG ===')
        }

        const shouldInclude = matchesSearch && matchesStatus && matchesSpeciality && matchesCountry

        return shouldInclude
    })

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'in progress':
                return 'bg-orange-100 text-orange-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified"
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading international patients...</span>
            </div>
        )
    }

    if (filteredPatients.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                    {loading ? "Loading..." : "No international patients found"}
                </div>
                {!loading && (
                    <p className="text-gray-400">
                        {searchQuery || selectedStatus || selectedSpeciality || selectedCountry
                            ? "Try adjusting your search criteria"
                            : "No international patients available yet"}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <Table className="border border-gray-200 rounded-lg border-collapse">
                <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            No.
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Name
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Age
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Gender
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Country
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Passport No.
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Department
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Referral Doctor
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Appointment Date
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
                            Status
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] text-center font-normal py-3">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPatients.map((patient, index) => (
                        <TableRow
                            key={patient._id}
                            className="hover:bg-blue-50 border-b border-gray-100 transition-all duration-200 hover:border-blue-200 group"
                        >
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {index + 1}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.patient_full_name || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.age || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.gender || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.country || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.passport_number || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.speciality || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.refer_doctor || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {formatDate(patient.appointment_date)}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(patient.status)}`}>
                                        {patient.status || "N/A"}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="py-3">
                                <div className="flex justify-center gap-2">
                                    <DropdownMenu
                                        open={openDropdownId === patient._id}
                                        onOpenChange={(open) => setOpenDropdownId(open ? patient._id : null)}
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
                                                onClick={() => handleViewPatient(patient)}
                                            >
                                                <Eye className="h-4 w-4 mr-3 text-gray-500" />
                                                View Details
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleEditPatient(patient)}
                                            >
                                                <Pencil className="h-4 w-4 mr-3 text-gray-500" />
                                                Edit Patient
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                                                onClick={() => handleUpdateStatus(patient)}
                                            >
                                                <Calendar className="h-4 w-4 mr-3 text-blue-500" />
                                                Update Status
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                                onClick={() => handleDeletePatient(patient)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-3 text-red-500" />
                                                Delete Patient
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* International Patient Details Modal */}
            {selectedPatient && (
                <InternationalPatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onSave={handlePatientUpdate}
                />
            )}

            {/* Edit International Patient Modal */}
            <AddInternationalPatientModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                patient={editingPatient}
                onSave={handlePatientUpdate}
                departments={departments}
                departmentsLoading={departmentsLoading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                patient={patientToDelete}
                onClose={() => setPatientToDelete(null)}
                onDeleteSuccess={handleDeleteSuccess}
            />

            {/* Update Status Modal */}
            <UpdateStatusModal
                open={statusUpdateModalOpen}
                onOpenChange={setStatusUpdateModalOpen}
                patient={statusUpdatePatient}
                onSave={handlePatientUpdate}
            />
        </div>
    )
} 