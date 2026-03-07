"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Upload,
  Eye,
  ChevronRight,
  Loader2,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPatientModal } from "../components/edit-patient-modal";
import { DeleteConfirmationModal } from "../components/delete-confirmation-modal";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import patient from "@/api/patient";

export default function PatientDetailsPage({ params }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lab");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  // ── Separate state for each tab so they never bleed into each other ──
  const [labReports, setLabReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // ── Prescription: appointments list + which one is selected ──
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  // Fetch patient data + initial lab reports
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const response = await patient.getPatientDataById(params.id);
        if (response.data) {
          setPatientData(response.data);
          // Only load lab reports on mount (prescription tab starts empty)
          const labReportsResponse = await patient.getLabReports(params.id);
          if (labReportsResponse.data) {
            setLabReports(labReportsResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to fetch patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [params.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    console.log("File details:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
    });

    if (file) {
      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid file type (jpg, png, pdf)");
        return;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      console.log("File validation passed, setting selected file");
      setSelectedFile(file);
    } else {
      console.log("No file selected");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    // For prescriptions, an appointment must be selected first
    if (activeTab === "prescription" && !selectedAppointmentId) {
      toast.error("Please select an appointment before uploading a prescription");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("uploaded_by", "Admin");

      let response;
      if (activeTab === "lab") {
        response = await patient.uploadLabReport(params.id, formData);
      } else {
        // Upload against the selected appointment ID
        response = await patient.uploadPrescription(selectedAppointmentId, formData);
      }

      if (response) {
        toast.success(
          `${activeTab === "lab" ? "Lab report" : "Prescription"} uploaded successfully`
        );
        setUploadModalOpen(false);
        setSelectedFile(null);
        // Refresh the correct list
        if (activeTab === "lab") {
          const labReportsResponse = await patient.getLabReports(params.id);
          if (labReportsResponse.data) setLabReports(labReportsResponse.data);
        } else {
          // Re-fetch prescriptions for the currently selected appointment
          const prescriptionsResponse = await patient.getPrescriptions(selectedAppointmentId);
          if (prescriptionsResponse.data) setPrescriptions(prescriptionsResponse.data);
        }
      } else {
        toast.error("Failed to upload document");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("An error occurred while uploading the document");
    } finally {
      setUploading(false);
    }
  };

  const handlePatientUpdate = () => {
    // Refresh patient data
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return "Not specified";
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return "Not specified";
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} yrs`;
  };

  const buildAddress = (p) => {
    const addr = p?.address || {};
    const parts = [
      addr.street || p?.street,
      addr.city || p?.city,
      addr.state || p?.state,
      addr.pincode || p?.pincode,
      addr.country || p?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  // Helper function to check if file is an image
  const isImageFile = (fileName, fileUrl) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".tiff",
    ];
    const fileNameLower = fileName?.toLowerCase() || "";
    const fileUrlLower = fileUrl?.toLowerCase() || "";

    // Check if filename ends with any image extension
    for (const ext of imageExtensions) {
      if (fileNameLower.endsWith(ext)) return true;
    }

    // Check if URL ends with any image extension
    for (const ext of imageExtensions) {
      if (fileUrlLower.endsWith(ext)) return true;
    }

    // Check if URL contains image extension but only at the end of the path
    for (const ext of imageExtensions) {
      if (fileUrlLower.includes(ext)) {
        const urlParts = fileUrlLower.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart.endsWith(ext)) return true;
      }
    }

    return false;
  };

  // Helper function to get file extension
  const getFileExtension = (fileName, fileUrl) => {
    const fileNameLower = fileName?.toLowerCase() || "";
    const fileUrlLower = fileUrl?.toLowerCase() || "";

    const extensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".tiff",
      ".pdf",
    ];

    // Check filename first
    for (const ext of extensions) {
      if (fileNameLower.endsWith(ext)) {
        return ext;
      }
    }

    // Check URL ending
    for (const ext of extensions) {
      if (fileUrlLower.endsWith(ext)) {
        return ext;
      }
    }

    // Check URL path ending
    for (const ext of extensions) {
      if (fileUrlLower.includes(ext)) {
        const urlParts = fileUrlLower.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart.endsWith(ext)) {
          return ext;
        }
      }
    }

    return null;
  };

  // Helper function to check if file is a PDF
  const isPdfFile = (fileName, fileUrl) => {
    const fileNameLower = fileName?.toLowerCase() || "";
    const fileUrlLower = fileUrl?.toLowerCase() || "";

    // Check if filename ends with .pdf
    if (fileNameLower.endsWith(".pdf")) return true;

    // Check if URL ends with .pdf (more precise than includes)
    if (fileUrlLower.endsWith(".pdf")) return true;

    // Check if URL contains .pdf but only at the end of the path
    if (fileUrlLower.includes(".pdf")) {
      const urlParts = fileUrlLower.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      return lastPart.endsWith(".pdf");
    }

    return false;
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === "lab") {
      // Refresh lab reports
      try {
        const labReportsResponse = await patient.getLabReports(params.id);
        if (labReportsResponse.data) setLabReports(labReportsResponse.data);
      } catch (error) {
        console.error("Error fetching lab reports:", error);
        toast.error("Failed to fetch lab reports");
      }
    } else {
      // Prescription tab: reset selection & prescriptions, then load appointments
      setSelectedAppointmentId(null);
      setPrescriptions([]);
      setAppointmentsLoading(true);
      try {
        const appointmentsResponse = await patient.getPatientAppointments(params.id);
        if (appointmentsResponse.data) {
          setAppointments(
            Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : []
          );
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    }
  };

  // Called when user clicks an appointment in the right panel
  const handleSelectAppointment = async (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setPrescriptions([]);
    setPrescriptionsLoading(true);
    try {
      const response = await patient.getPrescriptions(appointmentId);
      if (response.data) {
        setPrescriptions(Array.isArray(response.data) ? response.data : []);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to fetch prescriptions");
      setPrescriptions([]);
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentModalOpen(true);
  };

  const handleDeleteDocument = (doc) => {
    setSelectedDocument(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;

    setDeleting(true);
    try {
      let response;
      if (activeTab === "lab") {
        response = await patient.deleteLabReport(
          params.id,
          selectedDocument._id
        );
      } else {
        response = await patient.deletePrescription(
          selectedAppointmentId,
          selectedDocument._id
        );
      }

      if (response) {
        toast.success(
          `${activeTab === "lab" ? "Lab report" : "Prescription"} deleted successfully`
        );
        setDeleteModalOpen(false);
        setSelectedDocument(null);

        // Refresh the correct list
        if (activeTab === "lab") {
          const labReportsResponse = await patient.getLabReports(params.id);
          if (labReportsResponse.data) setLabReports(labReportsResponse.data);
        } else if (selectedAppointmentId) {
          const prescriptionsResponse = await patient.getPrescriptions(selectedAppointmentId);
          if (prescriptionsResponse.data) setPrescriptions(prescriptionsResponse.data);
        }
      } else {
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting the document");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading patient details...</span>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Patient not found</div>
        <Link href="/dashboard/patient">
          <Button variant="outline">Back to Patients</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/patient"
            className="flex items-center text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <Breadcrumb>
            <BreadcrumbList className="sm:gap-1">
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/patient">
                  Patients
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Patient Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#D9D9D9] text-[#005CD4]"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button
            variant="outline"
            className="border-[#D9D9D9] text-[#FF0037]"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Patient
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll space-y-4">
        {/* Patient Details Card */}
        <Card className="rounded-[14px] border-[#E2E2E2] py-0 shadow-none">
          <div className="flex divide-x-2 divide-[#DDDDDD]">
            {/* Avatar and Name Section */}
            <CardContent className="w-[25%] p-3 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#B4D5FF] flex items-center justify-center">
                <span className="text-3xl font-semibold text-white">
                  {patientData.patient_full_name?.[0] || "A"}
                </span>
              </div>
              <h2 className="text-lg text-[#4B4B4B] font-semibold mt-2">
                {patientData.patient_full_name}
              </h2>
              <p className="text-[#7F7F7F] text-sm">
                Phone no. {patientData.contact_number}
              </p>
            </CardContent>

            {/* Details Section */}
            <CardContent className="w-[75%] p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                <div>
                  <p className="text-sm text-[#7F7F7F]">Patient UHID</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.uhid || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Date of Birth</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.date_of_birth
                      ? `${formatDate(patientData.date_of_birth)} (${calculateAge(patientData.date_of_birth)})`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Gender</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Contact</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.contact_number || "Not specified"}
                  </p>
                </div>
                {buildAddress(patientData) && (
                  <div className="col-span-2">
                    <p className="text-sm text-[#7F7F7F]">Address</p>
                    <p className="font-medium text-[#4B4B4B] text-sm">
                      {buildAddress(patientData)}
                    </p>
                  </div>
                )}
                {patientData.medical_issue_details && (
                  <div className="col-span-2">
                    <p className="text-sm text-[#7F7F7F]">Medical Issue</p>
                    <p className="font-medium text-[#4B4B4B] text-sm">
                      {patientData.medical_issue_details}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Patient Documents Card */}
        <Card className="rounded-[14px] shadow-none border-[#D9D9D9] py-0">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-[#323232]">
                Patient Document
              </h2>
              {/* Tab Buttons */}
              <div className="flex gap-2 bg-[#F7F7F7] px-2 py-1 border border-[#DDDDDD] rounded-[10px]">
                <Button
                  variant={activeTab === "lab" ? "default" : "ghost"}
                  className={`rounded-md text-sm px-4 py-1 ${activeTab === "lab"
                    ? "bg-[#005CD4] text-white"
                    : "text-[#414141]"
                    }`}
                  onClick={() => handleTabChange("lab")}
                >
                  Lab report
                </Button>
                <Button
                  variant={activeTab === "prescription" ? "default" : "ghost"}
                  className={`rounded-md text-sm px-4 py-2 ${activeTab === "prescription"
                    ? "bg-[#0B5CF9] text-white"
                    : "text-[#4B4B4B]"
                    }`}
                  onClick={() => handleTabChange("prescription")}
                >
                  Prescription
                </Button>
              </div>
            </div>

            {activeTab === "lab" ? (
              /* ── LAB REPORTS GRID (unchanged) ── */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Existing Lab Report Documents */}
                {labReports.map((doc) => (
                  <TooltipProvider key={doc._id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="border border-[#EEEEEE] p-2.5 shadow-none rounded-[10px] bg-[#F6F6F6] hover:shadow-md transition-shadow duration-200 cursor-pointer">
                          <CardContent className="p-0">
                            <div className="mb-4">
                              {isPdfFile(doc.file_name, doc.file_url || doc.fileUrl) ? (
                                <div className="w-full h-[150px] bg-white rounded-md flex items-center justify-center border border-gray-200">
                                  <div className="text-center">
                                    <div className="text-red-500 text-4xl mb-2">📄</div>
                                    <p className="text-xs text-gray-500">PDF Document</p>
                                  </div>
                                </div>
                              ) : isImageFile(doc.file_name, doc.file_url || doc.fileUrl) ? (
                                <div className="w-full h-[150px] bg-white rounded-md border border-gray-200 overflow-hidden relative">
                                  <Image
                                    src={
                                      doc.file_url || doc.fileUrl
                                        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${doc.file_url || doc.fileUrl}`
                                        : "/placeholder.svg?height=150&width=300"
                                    }
                                    alt={doc.file_name || "Medical document"}
                                    width={300}
                                    height={150}
                                    className="w-full h-full object-cover rounded-md"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display = "flex";
                                    }}
                                  />
                                  <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center hidden">
                                    <div className="text-center">
                                      <div className="text-gray-400 text-2xl mb-1">🖼️</div>
                                      <p className="text-xs text-gray-500">Image</p>
                                    </div>
                                  </div>
                                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase()}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-[150px] bg-white rounded-md flex items-center justify-center border border-gray-200">
                                  <div className="text-center">
                                    <div className="text-gray-500 text-4xl mb-2">📄</div>
                                    <p className="text-xs text-gray-500">Document</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border-b-[1.4px] border-[#CCCCCC] pb-2">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-[#989898]">{formatDate(doc.uploaded_at || doc.uploadDate)}</p>
                                <span className={`px-2 py-1 text-xs rounded-full ${isImageFile(doc.file_name, doc.file_url || doc.fileUrl)
                                  ? "bg-blue-100 text-blue-700"
                                  : isPdfFile(doc.file_name, doc.file_url || doc.fileUrl)
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                  }`}>
                                  {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase() || "FILE"}
                                </span>
                              </div>
                              <h3 className="font-medium text-[#323232]">{doc.file_name || doc.title || "Medical Document"}</h3>
                              <p className="text-[13px] text-[#7F7F7F]">By . {doc.uploaded_by || doc.hospital || "Ashsheefa Hospital"}</p>
                              <p className="text-sm text-[#7F7F7F]">Lab Report</p>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline" size="sm"
                                className="flex-1 border-none bg-transparent shadow-none text-[#4B4B4B]"
                                onClick={() => handleViewDocument(doc)}
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </Button>
                              <Button
                                variant="outline" size="sm"
                                className="flex-1 border-none bg-transparent shadow-none text-[#FF0037]"
                                onClick={() => handleDeleteDocument(doc)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete Document
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-medium">{doc.file_name}</p>
                          <p className="text-xs text-gray-500">Type: {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase() || "FILE"}</p>
                          <p className="text-xs text-gray-500">Uploaded: {formatDate(doc.uploaded_at || doc.uploadDate)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {/* Upload Box */}
                <Card
                  className="border border-dashed border-[#BFBFBF] min-h-[250px] flex items-center justify-center text-center shadow-none cursor-pointer hover:border-[#005CD4] transition-colors"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="font-medium text-[#4B4B4B] mb-1">{labReports?.length === 0 ? "Upload" : "Upload More"}</p>
                    <p className="text-sm text-[#7F7F7F]">
                      File type: jpg, png, Pdf (Max 4 MB)
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /*PRESCRIPTION TAB */
              <div className="flex gap-4">
                {/* Left: Prescription documents grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Existing Prescription Documents */}
                    {prescriptionsLoading ? (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10 gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-[#0B5CF9]" />
                        <p className="text-xs text-[#7F7F7F]">Loading prescriptions...</p>
                      </div>
                    ) : !selectedAppointmentId ? (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10">
                        <p className="text-sm text-[#BFBFBF] text-center">Select an appointment from the right panel to view its prescriptions.</p>
                      </div>
                    ) : prescriptions.length === 0 ? (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10">
                        <p className="text-sm text-[#BFBFBF] text-center">No prescriptions found for this appointment.</p>
                      </div>
                    ) : prescriptions.map((doc) => (
                      <TooltipProvider key={doc._id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="border border-[#EEEEEE] p-2.5 shadow-none rounded-[10px] bg-[#F6F6F6] hover:shadow-md transition-shadow duration-200 cursor-pointer">
                              <CardContent className="p-0">
                                <div className="mb-4">
                                  {isPdfFile(doc.file_name, doc.file_url || doc.fileUrl) ? (
                                    <div className="w-full h-[130px] bg-white rounded-md flex items-center justify-center border border-gray-200">
                                      <div className="text-center">
                                        <div className="text-red-500 text-4xl mb-2">📄</div>
                                        <p className="text-xs text-gray-500">PDF Document</p>
                                      </div>
                                    </div>
                                  ) : isImageFile(doc.file_name, doc.file_url || doc.fileUrl) ? (
                                    <div className="w-full h-[130px] bg-white rounded-md border border-gray-200 overflow-hidden relative">
                                      <Image
                                        src={
                                          doc.file_url || doc.fileUrl
                                            ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${doc.file_url || doc.fileUrl}`
                                            : "/placeholder.svg?height=130&width=300"
                                        }
                                        alt={doc.file_name || "Medical document"}
                                        width={300}
                                        height={130}
                                        className="w-full h-full object-cover rounded-md"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                          e.target.nextSibling.style.display = "flex";
                                        }}
                                      />
                                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center hidden">
                                        <div className="text-center">
                                          <div className="text-gray-400 text-2xl mb-1">🖼️</div>
                                          <p className="text-xs text-gray-500">Image</p>
                                        </div>
                                      </div>
                                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                        {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase()}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-[130px] bg-white rounded-md flex items-center justify-center border border-gray-200">
                                      <div className="text-center">
                                        <div className="text-gray-500 text-4xl mb-2">📄</div>
                                        <p className="text-xs text-gray-500">Document</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="border-b-[1.4px] border-[#CCCCCC] pb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs text-[#989898]">{formatDate(doc.uploaded_at || doc.uploadDate)}</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${isImageFile(doc.file_name, doc.file_url || doc.fileUrl)
                                      ? "bg-blue-100 text-blue-700"
                                      : isPdfFile(doc.file_name, doc.file_url || doc.fileUrl)
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                      }`}>
                                      {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase() || "FILE"}
                                    </span>
                                  </div>
                                  <h3 className="font-medium text-[#323232]">{doc.file_name || doc.title || "Medical Document"}</h3>
                                  <p className="text-[13px] text-[#7F7F7F]">By . {doc.uploaded_by || doc.hospital || "Ashsheefa Hospital"}</p>
                                  <p className="text-sm text-[#7F7F7F]">Prescription</p>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline" size="sm"
                                    className="flex-1 border-none bg-transparent shadow-none text-[#4B4B4B]"
                                    onClick={() => handleViewDocument(doc)}
                                  >
                                    <Eye className="h-4 w-4" /> View Details
                                  </Button>
                                  <Button
                                    variant="outline" size="sm"
                                    className="flex-1 border-none bg-transparent shadow-none text-[#FF0037]"
                                    onClick={() => handleDeleteDocument(doc)}
                                  >
                                    <Trash2 className="h-4 w-4" /> Delete Document
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">{doc.file_name}</p>
                              <p className="text-xs text-gray-500">Type: {getFileExtension(doc.file_name, doc.file_url || doc.fileUrl)?.toUpperCase() || "FILE"}</p>
                              <p className="text-xs text-gray-500">Uploaded: {formatDate(doc.uploaded_at || doc.uploadDate)}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  {/* Upload Box */}
                  <Card
                    className="border border-dashed border-[#BFBFBF] min-h-[320px] flex items-center justify-center text-center shadow-none cursor-pointer hover:border-[#0B5CF9] transition-colors"
                    onClick={() => setUploadModalOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="font-medium text-[#4B4B4B] mb-1">{prescriptions?.length === 0 ? "Upload" : "Upload More"}</p>
                      <p className="text-sm text-[#7F7F7F]">File type: jpg, png, Pdf (Max 4 MB)</p>
                    </CardContent>
                  </Card>
                  </div>
                </div>

                {/* Right: Appointment Dates Panel */}
                <div className="w-auto shrink-0">
                  <Card className="rounded-[12px] border-[#E2E2E2] shadow-none">
                    <CardContent className="px-4 ">
                      <h3 className="text-sm font-semibold text-[#323232] mb-1">Appointment Dates</h3>
                      <p className="text-[11px] text-[#7F7F7F] mb-3">Click an appointment to load its prescriptions.</p>
                      {appointmentsLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-[#0B5CF9]" />
                          <p className="text-xs text-[#7F7F7F]">Loading appointments...</p>
                        </div>
                      ) : appointments.filter(a => (a.status || a.appointment_status) === "Confirmed").length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-sm text-[#BFBFBF] text-center">No confirmed appointments found for this patient.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {appointments
                            .filter(appt => (appt.status || appt.appointment_status) === "Confirmed")
                            .map((appt, idx) => {
                              const apptDate = appt.appointment_date || appt.date || appt.appointmentDate;
                              const isSelected = selectedAppointmentId === appt._id;

                              // ── Doctor name ──────────────────────────────
                              const doctorName =
                                appt.doctorId?.fullName ||
                                appt.doctorId?.name ||
                                appt.refer_doctor ||
                                null;

                              // ── Time formatting (24h → 12h AM/PM) ───────
                              const fmt12h = (t) => {
                                if (!t) return null;
                                const [hStr, mStr] = t.split(":");
                                let h = parseInt(hStr, 10);
                                const m = mStr || "00";
                                const meridiem = h >= 12 ? "PM" : "AM";
                                if (h === 0) h = 12;
                                else if (h > 12) h -= 12;
                                return `${h}:${m} ${meridiem}`;
                              };
                              const startFmt = fmt12h(appt.slot_start_time);
                              const endFmt = fmt12h(appt.slot_end_time);
                              const timeDisplay = startFmt
                                ? endFmt
                                  ? `${startFmt} – ${endFmt}`
                                  : startFmt
                                : null;

                              return (
                                <div
                                  key={appt._id || idx}
                                  onClick={() => handleSelectAppointment(appt._id)}
                                  className={`flex items-start gap-3 p-2.5 rounded-[8px] border cursor-pointer transition-all ${isSelected
                                    ? "bg-[#EEF4FF] border-[#0B5CF9] shadow-sm"
                                    : "bg-[#F7F9FF] border-[#E8EEFF] hover:border-[#0B5CF9]"
                                    }`}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-[#0B5CF9]" : "bg-[#0B5CF9]/10"
                                    }`}>
                                    <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#0B5CF9]"
                                      }`}>{idx + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    {/* Date */}
                                    <p className="text-xs font-semibold text-[#323232]">
                                      {apptDate
                                        ? new Date(apptDate).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })
                                        : "Date not set"}
                                    </p>
                                    {/* Time */}
                                    {timeDisplay && (
                                      <p className="text-[11px] text-[#7F7F7F] mt-0.5">{timeDisplay}</p>
                                    )}
                                    {/* Doctor name */}
                                    {doctorName && (
                                      <p className="text-[11px] text-[#0B5CF9] mt-0.5 truncate font-medium">
                                        Dr. {doctorName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isEditModalOpen && (
        <EditPatientModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          patient={patientData}
          onSave={handlePatientUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          patient={patientData}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteSuccess={() => {
            setIsDeleteModalOpen(false);
            window.location.href = "/dashboard/patient";
          }}
        />
      )}

      {/* Upload Document Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#4B4B4B] text-base">
                Upload {activeTab === "lab" ? "Lab Report" : "Prescription"}
              </DialogTitle>
              {/* <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setUploadModalOpen(false)}
                 className="h-6 w-6"
               >
                 <X className="h-4 w-4" />
               </Button> */}
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-[#4A4A4B] text-sm">
                Select File*
              </Label>
              <Input
                id="document"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="bg-[#FBFBFB] rounded-[6px] border-[#DDDDDD] shadow-none"
                disabled={uploading}
                name="file"
                required
              />
              <p className="text-xs text-gray-500">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-[#005CD4] hover:bg-blue-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document View Modal */}
      <Dialog open={documentModalOpen} onOpenChange={setDocumentModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[#4B4B4B] text-base">
                  {selectedDocument?.file_name || "Document"}
                </DialogTitle>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${isImageFile(
                    selectedDocument?.file_name,
                    selectedDocument?.file_url || selectedDocument?.fileUrl
                  )
                    ? "bg-blue-100 text-blue-700"
                    : isPdfFile(
                      selectedDocument?.file_name,
                      selectedDocument?.file_url ||
                      selectedDocument?.fileUrl
                    )
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {getFileExtension(
                    selectedDocument?.file_name,
                    selectedDocument?.file_url || selectedDocument?.fileUrl
                  )?.toUpperCase() || "FILE"}
                </span>
              </div>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setDocumentModalOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-3">
            {/* Document Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500">File Name</p>
                  <p className="font-medium">{selectedDocument?.file_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Upload Date</p>
                  <p className="font-medium">
                    {formatDate(selectedDocument?.uploaded_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Uploaded By</p>
                  <p className="font-medium">{selectedDocument?.uploaded_by}</p>
                </div>
                <div>
                  <p className="text-gray-500">Document Type</p>
                  <p className="font-medium">
                    {activeTab === "lab" ? "Lab Report" : "Prescription"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">File Type</p>
                  <p className="font-medium">
                    {getFileExtension(
                      selectedDocument?.file_name,
                      selectedDocument?.file_url || selectedDocument?.fileUrl
                    )?.toUpperCase() || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Preview */}
            <div className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Document Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const baseURL =
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:3000";
                    const fullUrl = `${baseURL}${selectedDocument?.file_url || selectedDocument?.fileUrl
                      }`;
                    window.open(fullUrl, "_blank");
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Document Preview */}
              {isPdfFile(
                selectedDocument?.file_name,
                selectedDocument?.file_url || selectedDocument?.fileUrl
              ) ? (
                <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 text-6xl mb-3">📄</div>
                    <p className="text-gray-500 mb-2">PDF Document</p>
                    <p className="text-sm text-gray-400">
                      Click Download to view the PDF
                    </p>
                  </div>
                </div>
              ) : isImageFile(
                selectedDocument?.file_name,
                selectedDocument?.file_url || selectedDocument?.fileUrl
              ) ? (
                <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                  <Image
                    src={
                      selectedDocument?.file_url || selectedDocument?.fileUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:3000"
                        }${selectedDocument?.file_url ||
                        selectedDocument?.fileUrl
                        }`
                        : "/placeholder.svg?height=400&width=600"
                    }
                    alt={selectedDocument?.file_name || "Document preview"}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain cursor-zoom-in"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    onClick={() => {
                      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:3000"
                        }${selectedDocument?.file_url || selectedDocument?.fileUrl
                        }`;
                      window.open(fullUrl, "_blank");
                    }}
                  />
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center hidden">
                    <div className="text-center">
                      <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                      <p className="text-gray-500 mb-2">Image Preview</p>
                      <p className="text-sm text-gray-400">
                        Unable to load image preview
                      </p>
                    </div>
                  </div>
                  {/* Image overlay with zoom hint */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Click to view full size
                  </div>
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-500 text-6xl mb-3">📄</div>
                    <p className="text-gray-500 mb-2">Document</p>
                    <p className="text-sm text-gray-400">
                      Click Download to view the document
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDocumentModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDocumentModalOpen(false);
                  handleDeleteDocument(selectedDocument);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#4B4B4B] text-base">
              Delete {activeTab === "lab" ? "Lab Report" : "Prescription"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-500 text-2xl mr-3">⚠️</div>
                <div>
                  <p className="font-medium text-red-800">
                    Are you sure you want to delete this document?
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Document Details:</p>
              <p className="text-sm text-gray-600">
                {selectedDocument?.file_name}
              </p>
              <p className="text-xs text-gray-500">
                Uploaded on {formatDate(selectedDocument?.uploaded_at)}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedDocument(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Document"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
