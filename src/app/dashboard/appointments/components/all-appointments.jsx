"use client"

import { useState, useEffect } from "react"
import { Ellipsis, Eye, Pencil, Trash2, Loader2, CheckCircle, Receipt, Phone, MapPin, User } from "lucide-react"
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
import { EditAppointmentModal } from "./edit-appointment-modal"
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
            // Fetch all appointments — status/speciality filtering is client-side
            const params = {
                page: 1,
                limit: 200,
            }

            const response = await appointments.getAllAppointments(params)

            let appointmentsData = null
            let paginationData = null

            if (response.data && response.data.data) {
                appointmentsData = response.data.data
                paginationData = response.data.pagination
            } else if (response.data && Array.isArray(response.data)) {
                appointmentsData = response.data
                paginationData = null
            }

            if (appointmentsData) {
                setAppointmentsList(appointmentsData)
                setPagination(paginationData || {
                    current_page: 1,
                    total_pages: 1,
                    total_records: appointmentsData.length,
                    limit: 200
                })
            } else {
                setAppointmentsList([])
                setPagination({
                    current_page: 1,
                    total_pages: 1,
                    total_records: 0,
                    limit: 200
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

    // Re-fetch only when server-side filters change (search is handled client-side)
    useEffect(() => {
        fetchAppointments()
    }, [selectedStatus, selectedSpeciality])

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
            ? appointment.patientId?.patient_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.patient_full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.patientId?.contact_number?.includes(searchQuery) ||
            appointment.contact_number?.includes(searchQuery) ||
            appointment.refer_doctor?.toLowerCase().includes(searchQuery.toLowerCase())
            : true

        // Normalise the stored status — the API may return either field name
        const apptStatus = (appointment.status || appointment.appointment_status || "").toLowerCase()

        // Convert dropdown slug back to readable text  e.g. "in-progress" → "in progress"
        const statusFilter = selectedStatus ? selectedStatus.replace(/-/g, " ").toLowerCase() : ""

        const matchesStatus = selectedStatus && selectedStatus !== "all-status"
            ? apptStatus === statusFilter || apptStatus.includes(statusFilter)
            : true

        const specialityFilter = selectedSpeciality ? selectedSpeciality.replace(/-/g, " ").toLowerCase() : ""
        const apptSpeciality = (appointment.speciality || appointment.doctorId?.department || "").toLowerCase()

        const matchesSpeciality = selectedSpeciality && selectedSpeciality !== "all-specialities"
            ? apptSpeciality === specialityFilter || apptSpeciality.includes(specialityFilter)
            : true

        return matchesSearch && matchesStatus && matchesSpeciality
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
            case 'paid':
                return 'bg-green-100 text-green-800'
            case 'failed':
                return 'bg-red-100 text-red-800'
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

    const formatTime = (time) => {
        if (!time) return ""
        const [h, m] = time.split(":").map(Number)
        const suffix = h >= 12 ? "PM" : "AM"
        const hr = h % 12 || 12
        return `${hr}:${String(m).padStart(2, "0")} ${suffix}`
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
                            Gender
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Contact
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Department
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Doctor
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Appointment Date/Time
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3">
                            Fees
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
                            Appointment Status
                        </TableHead>
                        <TableHead className="text-[#7F7F7F] font-normal border-r border-gray-200 py-3 text-center">
                            Payment Status
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
                                {appointment.patientId?.patient_full_name || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.patientId?.gender || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.patientId?.contact_number || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.doctorId?.department || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                {appointment.doctorId?.fullName || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200">
                                <div className="text-sm">
                                    <div className="font-medium text-gray-800">{formatDate(appointment.appointment_date)}</div>
                                    {appointment.slot_start_time && (
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {formatTime(appointment.slot_start_time)}
                                            {appointment.slot_end_time && ` – ${formatTime(appointment.slot_end_time)}`}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                {appointment.amount || appointment.doctorId?.fees || "N/A"}
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                                        {appointment.status || "N/A"}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-200 py-3 group-hover:border-blue-300 transition-colors duration-200 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(appointment.paymentStatus
                                    )}`}>
                                        {appointment.paymentStatus
                                            || "N/A"}
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

                                            {appointment.paymentStatus === "paid" ? (
                                                <DropdownMenuItem
                                                    className="flex items-center px-2 py-2 text-sm text-green-700 hover:bg-green-50 cursor-pointer transition-colors"
                                                    onClick={() => handleUpdateStatus(appointment)}
                                                >
                                                    <Receipt className="h-4 w-4 mr-2 text-green-600" />
                                                    Payment Details
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="flex items-center px-2 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer transition-colors"
                                                    onClick={() => handleUpdateStatus(appointment)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                    Mark as Paid
                                                </DropdownMenuItem>
                                            )}

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
            <EditAppointmentModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                appointment={editingAppointment}
                onSave={handleAppointmentUpdate}
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