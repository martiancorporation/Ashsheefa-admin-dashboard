"use client"

import { useState, useEffect } from "react"
import { Ellipsis, Eye, Pencil, Trash2, Loader2, Calendar, Phone, MapPin, User, Hash } from "lucide-react"
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
import { AddPatientModal } from "./add-patient-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { UpdateStatusModal } from "./update-status-modal"
import { toast } from "sonner"
import patient from "@/api/patient"
import { useRouter } from "next/navigation"

export default function AllPatients({
    searchQuery = "",
    selectedStatus = "",
    selectedSpeciality = "",
    onPatientUpdate,
}) {
    const router = useRouter()
    const [patientsList, setPatientsList] = useState([])
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

    // Fetch patients from API
    const fetchPatients = async () => {
        setLoading(true)
        try {
            // Convert filter values back to original format for API
            const statusParam = selectedStatus && selectedStatus !== 'all-status' ? selectedStatus.replace(/-/g, ' ') : ''
            const specialityParam = selectedSpeciality && selectedSpeciality !== 'all-specialities' ? selectedSpeciality.replace(/-/g, ' ') : ''

            const params = {
                page: 1,
                limit: 50,
                search: searchQuery,
                status: statusParam,
                speciality: specialityParam,
            }

            const response = await patient.getAllPatients(params)

            // Check if the data is directly in response.data or nested
            let patientsData = null
            let paginationData = null

            if (response.data && response.data.data) {
                // Direct structure: response.data.data
                patientsData = response.data.data
                paginationData = response.data.pagination
            } else if (response.data && Array.isArray(response.data)) {
                // Direct array structure
                patientsData = response.data
                paginationData = null
            }

            if (patientsData) {
                console.log('=== PATIENTS DATA LOADED ===')
                console.log('First 3 patients data:', patientsData.slice(0, 3).map(p => ({
                    name: p.patient_full_name,
                    uhid: p.uhid,
                    status: p.status,
                    speciality: p.speciality
                })))
                console.log('=== END PATIENTS DATA ===')

                setPatientsList(patientsData)
                setPagination(paginationData || {
                    current_page: 1,
                    total_pages: 1,
                    total_records: patientsData.length,
                    limit: 50
                })
            } else {
                setPatientsList([])
                setPagination({
                    current_page: 1,
                    total_pages: 1,
                    total_records: 0,
                    limit: 50
                })
            }
        } catch (error) {
            console.error("Error fetching patients:", error)
            toast.error("Failed to fetch patients")
            setPatientsList([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch data on component mount and when filters change
    useEffect(() => {
        console.log('Filter values changed:', {
            searchQuery,
            selectedStatus,
            selectedSpeciality
        })
        fetchPatients()
    }, [searchQuery, selectedStatus, selectedSpeciality])

    // Handle patient refresh after add/edit/delete
    const handlePatientUpdate = () => {
        if (onPatientUpdate) {
            onPatientUpdate()
        } else {
            fetchPatients()
        }
    }

    const handleViewPatient = (patient) => {
        router.push(`/dashboard/patient/${patient._id}`)
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
        fetchPatients() // Refresh the list
        setPatientToDelete(null)
    }

    // Filter patients based on search and filters
    const filteredPatients = patientsList.filter((patient) => {
        // Show all patients if no filters are applied
        if (!searchQuery && !selectedStatus && !selectedSpeciality) {
            return true
        }

        const matchesSearch = searchQuery
            ? patient.patient_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.uhid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.contact_number?.includes(searchQuery) ||
            patient.refer_doctor?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        // Convert filter values back to original format for comparison
        const statusFilter = selectedStatus ? selectedStatus.replace(/-/g, ' ').toLowerCase() : ''
        const specialityFilter = selectedSpeciality ? selectedSpeciality.replace(/-/g, ' ').toLowerCase() : ''

        // Also try exact match with original dropdown values
        const statusExact = selectedStatus ? selectedStatus : ''
        const specialityExact = selectedSpeciality ? selectedSpeciality : ''

        // Handle "All" options - they should match everything
        const matchesStatus = selectedStatus && selectedStatus !== 'all-status'
            ? patient.status?.toLowerCase() === statusFilter ||
            patient.status?.toLowerCase().includes(statusFilter) ||
            statusFilter.includes(patient.status?.toLowerCase()) ||
            patient.status?.toLowerCase() === statusExact ||
            patient.status?.toLowerCase() === statusExact.replace(/-/g, ' ')
            : true

        const matchesSpeciality = selectedSpeciality && selectedSpeciality !== 'all-specialities'
            ? patient.speciality?.toLowerCase() === specialityFilter ||
            patient.speciality?.toLowerCase().includes(specialityFilter) ||
            specialityFilter.includes(patient.speciality?.toLowerCase()) ||
            patient.speciality?.toLowerCase() === specialityExact ||
            patient.speciality?.toLowerCase() === specialityExact.replace(/-/g, ' ')
            : true

        // Debug logging for first patient only to avoid spam
        if ((selectedStatus || selectedSpeciality) && patientsList.indexOf(patient) === 0) {
            console.log('=== FILTER DEBUG ===')
            console.log('Available patients data:', patientsList.map(p => ({
                name: p.patient_full_name,
                uhid: p.uhid,
                status: p.status,
                speciality: p.speciality
            })))
            console.log('Current filter values:', {
                selectedStatus,
                statusFilter,
                selectedSpeciality,
                specialityFilter
            })
            console.log('Current patient being filtered:', {
                name: patient.patient_full_name,
                uhid: patient.uhid,
                status: patient.status,
                speciality: patient.speciality
            })
            console.log('Matches:', {
                matchesStatus,
                matchesSpeciality
            })
            console.log('=== END DEBUG ===')
        }

        const shouldInclude = matchesSearch && matchesStatus && matchesSpeciality

        return shouldInclude
    })

    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'in treatment':
                return 'bg-blue-100 text-blue-800'
            case 'discharged':
                return 'bg-green-100 text-green-800'
            case 'under observation':
                return 'bg-yellow-100 text-yellow-800'
            case 'scheduled':
                return 'bg-purple-100 text-purple-800'
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
                <span className="ml-2 text-gray-600">Loading patients...</span>
            </div>
        )
    }

    if (filteredPatients.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                    {loading ? "Loading..." : "No patients found"}
                </div>
                {!loading && (
                    <p className="text-gray-400">
                        {searchQuery || selectedStatus || selectedSpeciality
                            ? "Try adjusting your search criteria"
                            : "No patients available yet"}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <Table className="border-collapse border border-gray-200">
                <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            No.
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            UHID
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
                            Contact
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Department
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
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {index + 1}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                <div className="flex items-center gap-2">
                                    {/* <Hash className="h-3 w-3 text-gray-500" /> */}
                                    {patient.uhid || "N/A"}
                                </div>
                            </TableCell>
                        <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.patient_full_name || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.age || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.gender || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.contact_number || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {patient.speciality || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200">
                                {formatDate(patient.appointment_date)}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-2 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(patient.status)}`}>
                                        {patient.status || "N/A"}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="py-2">
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



            {/* Edit Patient Modal */}
            <AddPatientModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                patient={editingPatient}
                onSave={handlePatientUpdate}
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