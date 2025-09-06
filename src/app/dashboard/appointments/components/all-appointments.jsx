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
import { AppointmentDetailsModal } from "./appointment-details-modal"
import { AddAppointmentModal } from "./add-appointment-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { UpdateStatusModal } from "./update-status-modal"
import { toast } from "sonner"
import appointments from "@/api/appointments"

export default function AllAppointments({
    searchQuery = "",
    selectedStatus = "",
    selectedSpeciality = "",
    onAppointmentUpdate,
    departments = [],
    departmentsLoading = false,
}) {
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [appointmentsList, setAppointmentsList] = useState([])
    const [loading, setLoading] = useState(true)
    const [openDropdownId, setOpenDropdownId] = useState(null)
    const [appointmentToDelete, setAppointmentToDelete] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [statusUpdateModalOpen, setStatusUpdateModalOpen] = useState(false)
    const [statusUpdateAppointment, setStatusUpdateAppointment] = useState(null)
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        limit: 10
    })

    // Fetch appointments from API
    const fetchAppointments = async () => {
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

            const response = await appointments.getAllAppointments(params)

            // Check if the data is directly in response.data or nested
            let appointmentsData = null
            let paginationData = null

            if (response.data && response.data.data) {
                // Direct structure: response.data.data
                appointmentsData = response.data.data
                paginationData = response.data.pagination
            } else if (response.data && Array.isArray(response.data)) {
                // Direct array structure
                appointmentsData = response.data
                paginationData = null
            }

            if (appointmentsData) {
                console.log('=== APPOINTMENTS DATA LOADED ===')
                console.log('First 3 appointments data:', appointmentsData.slice(0, 3).map(a => ({
                    name: a.patient_full_name,
                    status: a.status,
                    speciality: a.speciality
                })))
                console.log('=== END APPOINTMENTS DATA ===')

                setAppointmentsList(appointmentsData)
                setPagination(paginationData || {
                    current_page: 1,
                    total_pages: 1,
                    total_records: appointmentsData.length,
                    limit: 50
                })
            } else {
                setAppointmentsList([])
                setPagination({
                    current_page: 1,
                    total_pages: 1,
                    total_records: 0,
                    limit: 50
                })
            }
        } catch (error) {
            console.error("Error fetching appointments:", error)
            toast.error("Failed to fetch appointments")
            setAppointmentsList([])
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
        fetchAppointments()
    }, [searchQuery, selectedStatus, selectedSpeciality])

    // Handle appointment refresh after add/edit/delete
    const handleAppointmentUpdate = () => {
        if (onAppointmentUpdate) {
            onAppointmentUpdate()
        } else {
            fetchAppointments()
        }
    }

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment)
        setOpenDropdownId(null) // Close dropdown when view details is clicked
    }

    const handleEditAppointment = (appointment) => {
        setEditingAppointment(appointment)
        setEditModalOpen(true)
        setOpenDropdownId(null) // Close dropdown when edit is clicked
    }

    const handleUpdateStatus = (appointment) => {
        setStatusUpdateAppointment(appointment)
        setStatusUpdateModalOpen(true)
        setOpenDropdownId(null) // Close dropdown when update status is clicked
    }

    const handleDeleteAppointment = (appointment) => {
        setAppointmentToDelete(appointment)
        setOpenDropdownId(null) // Close dropdown when delete is clicked
    }

    const handleDeleteSuccess = () => {
        fetchAppointments() // Refresh the list
        setAppointmentToDelete(null)
    }

    // Filter appointments based on search and filters
    const filteredAppointments = appointmentsList.filter((appointment) => {
        // Show all appointments if no filters are applied
        if (!searchQuery && !selectedStatus && !selectedSpeciality) {
            return true
        }

        const matchesSearch = searchQuery
            ? appointment.patient_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.contact_number?.includes(searchQuery) ||
            appointment.refer_doctor?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        // Convert filter values back to original format for comparison
        const statusFilter = selectedStatus ? selectedStatus.replace(/-/g, ' ').toLowerCase() : ''
        const specialityFilter = selectedSpeciality ? selectedSpeciality.replace(/-/g, ' ').toLowerCase() : ''

        // Also try exact match with original dropdown values
        const statusExact = selectedStatus ? selectedStatus : ''
        const specialityExact = selectedSpeciality ? selectedSpeciality : ''

        // Handle "All" options - they should match everything
        const matchesStatus = selectedStatus && selectedStatus !== 'all-status'
            ? appointment.status?.toLowerCase() === statusFilter ||
            appointment.status?.toLowerCase().includes(statusFilter) ||
            statusFilter.includes(appointment.status?.toLowerCase()) ||
            appointment.status?.toLowerCase() === statusExact ||
            appointment.status?.toLowerCase() === statusExact.replace(/-/g, ' ')
            : true

        const matchesSpeciality = selectedSpeciality && selectedSpeciality !== 'all-specialities'
            ? appointment.speciality?.toLowerCase() === specialityFilter ||
            appointment.speciality?.toLowerCase().includes(specialityFilter) ||
            specialityFilter.includes(appointment.speciality?.toLowerCase()) ||
            appointment.speciality?.toLowerCase() === specialityExact ||
            appointment.speciality?.toLowerCase() === specialityExact.replace(/-/g, ' ')
            : true

        // Debug logging for first appointment only to avoid spam
        if ((selectedStatus || selectedSpeciality) && appointmentsList.indexOf(appointment) === 0) {
            console.log('=== FILTER DEBUG ===')
            console.log('Available appointments data:', appointmentsList.map(a => ({
                name: a.patient_full_name,
                status: a.status,
                speciality: a.speciality
            })))
            console.log('Current filter values:', {
                selectedStatus,
                statusFilter,
                selectedSpeciality,
                specialityFilter
            })
            console.log('Current appointment being filtered:', {
                name: appointment.patient_full_name,
                status: appointment.status,
                speciality: appointment.speciality
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
                <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
        )
    }

    if (filteredAppointments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                    {loading ? "Loading..." : "No appointments found"}
                </div>
                {!loading && (
                    <p className="text-gray-400">
                        {searchQuery || selectedStatus || selectedSpeciality
                            ? "Try adjusting your search criteria"
                            : "No appointments available yet"}
                    </p>
                )}
            </div>
        )
    }

    return (
        <div className="w-full">
            <Table className="border-collapse border border-gray-200 ">
                <TableHeader>
                    <TableRow className="bg-gray-50 border border-gray-200">
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
                            Contact
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Department
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Refer Doctor
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
                    {filteredAppointments.map((appointment, index) => (
                        <TableRow
                            key={appointment._id}
                            className="hover:bg-blue-50 border-b border-gray-100 transition-all duration-200 hover:border-blue-200 group"
                        >
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {index + 1}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.patient_full_name || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.age || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.gender || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.contact_number || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.speciality || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.refer_doctor || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {formatDate(appointment.appointment_date)}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                                        {appointment.status || "N/A"}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="py-3">
                                <div className="flex justify-center gap-2">
                                    <DropdownMenu
                                        open={openDropdownId === appointment._id}
                                        onOpenChange={(open) => setOpenDropdownId(open ? appointment._id : null)}
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
                                                className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleViewAppointment(appointment)}
                                            >
                                                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                                View Details
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleEditAppointment(appointment)}
                                            >
                                                <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                                                Edit Appointment
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                                                onClick={() => handleUpdateStatus(appointment)}
                                            >
                                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                                Update Status
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="flex items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                                onClick={() => handleDeleteAppointment(appointment)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                Delete Appointment
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <AppointmentDetailsModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onSave={handleAppointmentUpdate}
                />
            )}

            {/* Edit Appointment Modal */}
            <AddAppointmentModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                appointment={editingAppointment}
                onSave={handleAppointmentUpdate}
                departments={departments}
                departmentsLoading={departmentsLoading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                appointment={appointmentToDelete}
                onClose={() => setAppointmentToDelete(null)}
                onDeleteSuccess={handleDeleteSuccess}
            />

            {/* Update Status Modal */}
            <UpdateStatusModal
                open={statusUpdateModalOpen}
                onOpenChange={setStatusUpdateModalOpen}
                appointment={statusUpdateAppointment}
                onSave={handleAppointmentUpdate}
            />
        </div>
    )
} 