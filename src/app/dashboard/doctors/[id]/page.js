"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  PencilLine,
  Trash2,
  Calendar,
  Stethoscope,
  Clock,
  Globe,
  ChevronRight,
  Check,
  X,
  Save,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // Form state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [schedule, setSchedule] = useState({
    monday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
  });
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    regNo: "",
    experience: "",
    contactNumber: "",
    qualification: "",
    bio: "",
    email: "",
    specialization: "",
    isActive: true,
  });

  const timeOptions = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];

  const toggleAvailability = () => {
    setShowAvailability(!showAvailability);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to original doctor data
    if (doctor) {
      setFormData({
        fullName: doctor.fullName || "",
        department: doctor.department || "",
        regNo: doctor.regNo || "",
        experience: doctor.experience || "",
        contactNumber: doctor.contactNumber || "",
        qualification: doctor.qualification || "",
        bio: doctor.bio || "",
        email: doctor.email || "",
        specialization: doctor.specialization || "",
        isActive: doctor.isActive ?? true,
      });
      setPhotoUrl(doctor.profilePic || "");
      setPhotoFile(null);
      setSelectedLanguages(doctor.languages || []);

      // Reset schedule
      const newSchedule = {};
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].forEach((day) => {
        const dayData = doctor.availability?.find(
          (a) => a.day.toLowerCase() === day,
        );
        newSchedule[day] = {
          enabled: dayData?.isAvailable || false,
          startTime: dayData?.startTime || "09:00",
          endTime: dayData?.endTime || "17:00",
        };
      });
      setSchedule(newSchedule);
    }
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
    );
  };

  const handlePhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and JPG are allowed.");
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be under 2 MB.");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setPhotoFile(null);
    setPhotoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleToggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleSaveDoctor = async () => {
    setIsSaving(true);
    try {
      const authDataString = localStorage.getItem("authentications");
      const authData = JSON.parse(authDataString);

      // Build availability array
      const availability = Object.entries(schedule).map(([day, data]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        isAvailable: data.enabled,
        startTime: data.enabled ? data.startTime : null,
        endTime: data.enabled ? data.endTime : null,
      }));

      // Build the update payload as JSON (matching the working implementation)
      const updatePayload = {
        _id: id,
        fullName: formData.fullName,
        department: formData.department,
        regNo: formData.regNo,
        experience: Number(formData.experience) || 0,
        contactNumber: formData.contactNumber,
        qualification: formData.qualification,
        bio: formData.bio,
        email: formData.email,
        specialization: formData.specialization,
        isActive: formData.isActive,
        languages: selectedLanguages,
        availability: availability,
        profilePic: photoUrl, // Keep existing photo URL or updated one
      };

      console.log("Update payload:", updatePayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/dashboard/doctors/update_doctor_data/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.access_token}`,
          },
          body: JSON.stringify(updatePayload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update doctor");
      }

      const result = await response.json();
      setIsEditMode(false);
      toast.success("Doctor updated successfully!");

      // Refresh the page data
      await fetchDoctor();
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error(
        error.message || "Failed to update doctor. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await API.department.getAllDepartments(1, 100); // Get all departments

      if (response && response.departments) {
        const departmentNames = response.departments
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
        setDepartments(departmentNames);
      } else if (response && response.data) {
        const departmentNames = response.data
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
        setDepartments(departmentNames);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Fallback to static list if API fails
      setDepartments([
        "General Medicine",
        "General Surgery",
        "Cardiology",
        "Neurology",
        "Neurosurgery",
        "Orthopedics",
        "Pediatrics",
        "Obstetrics & Gynecology",
        "Dermatology",
        "Psychiatry",
        "Ophthalmology",
        "ENT",
        "Oncology",
        "Urology",
        "Nephrology",
        "Pulmonology",
        "Gastroenterology",
        "Endocrinology",
        "Radiology",
        "Anesthesiology",
        "Pathology",
        "Hematology",
        "Rheumatology",
        "Plastic Surgery",
        "Cardiothoracic Surgery",
        "Forensic Medicine",
        "Family Medicine",
        "Sports Medicine",
      ]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchDoctor = async () => {
    const authDataString = localStorage.getItem("authentications");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/dashboard/doctors/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(authDataString)?.access_token}`,
          },
        },
      );
      const data = await res.json();
      setDoctor(data);

      // Initialize form data
      setFormData({
        fullName: data.fullName || "",
        department: data.department || "",
        regNo: data.regNo || "",
        experience: data.experience || "",
        contactNumber: data.contactNumber || "",
        qualification: data.qualification || "",
        bio: data.bio || "",
        email: data.email || "",
        specialization: data.specialization || "",
        isActive: data.isActive ?? true,
      });
      setPhotoUrl(data.profilePic || "");
      setSelectedLanguages(data.languages || []);

      // Initialize schedule from availability
      const newSchedule = {};
      [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ].forEach((day) => {
        const dayData = data.availability?.find(
          (a) => a.day.toLowerCase() === day,
        );
        newSchedule[day] = {
          enabled: dayData?.isAvailable || false,
          startTime: dayData?.startTime || "09:00",
          endTime: dayData?.endTime || "17:00",
        };
      });
      setSchedule(newSchedule);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDoctor();
      fetchDepartments();
    }
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!doctor) return <div className="p-6">Doctor not found</div>;

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Breadcrumb */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 hover:text-black"
          >
            <ArrowLeft size={16} />
          </button>
          <span>|</span>
          <span className="text-black font-medium">Doctor Details</span>
        </div>
        <div className="flex gap-3">
          {!isEditMode ? (
            <>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center font-medium"
              >
                <PencilLine className="mr-2" size={14} />
                Edit Doctor
              </button>

              <button className="px-4 py-2 border rounded-md text-red-600 border-red-600 hover:bg-red-50 flex items-center font-medium">
                <Trash2 className="mr-2" size={14} />
                Delete Doctor
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-4 py-2 border rounded-md text-gray-600 border-gray-600 hover:bg-gray-50 flex items-center font-medium disabled:opacity-50"
              >
                <X className="mr-2" size={14} />
                Cancel
              </button>
              <button
                onClick={handleSaveDoctor}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Column - Doctor Details */}
        <div className="space-y-6">
          {/* Top Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/jpg"
                  className="hidden"
                />
                <div
                  onClick={isEditMode ? handlePhotoUpload : undefined}
                  className={`w-20 h-20 rounded-full overflow-hidden border flex-shrink-0 ${
                    isEditMode
                      ? "cursor-pointer hover:opacity-75 transition-opacity relative group"
                      : ""
                  }`}
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={formData.fullName}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  {isEditMode && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <PencilLine
                        size={20}
                        className="text-white transition-opacity z-20"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                {isEditMode ? (
                  <>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="text-xl font-bold mb-2"
                      placeholder="Full Name"
                    />
                    <Input
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="text-gray-500 mb-2"
                      placeholder="Qualification"
                    />
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Reg No:</Label>
                      <Input
                        name="regNo"
                        value={formData.regNo}
                        onChange={handleChange}
                        className="flex-1"
                        placeholder="Registration Number"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{formData.fullName}</h2>
                    <p className="text-gray-500">
                      {formData.qualification}
                      {formData.regNo && `, Reg No. ${formData.regNo}`}
                    </p>
                  </>
                )}

                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Phone size={14} />
                  {isEditMode ? (
                    <Input
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="flex-1"
                      placeholder="Contact Number"
                    />
                  ) : (
                    <span>+91 {formData.contactNumber}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center border border-[#EEEEEE] rounded-md">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Experience</div>
                  {isEditMode ? (
                    <Input
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      className="font-medium h-8"
                      placeholder="Years"
                    />
                  ) : (
                    <div className="font-medium">
                      {formData.experience || 0}+ Years
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center border border-[#EEEEEE] rounded-md">
                  <Stethoscope size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Department</div>
                  {isEditMode ? (
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        handleSelectChange("department", value)
                      }
                      disabled={departmentsLoading}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="font-medium">{formData.department}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center border border-[#EEEEEE] rounded-md">
                  <Clock size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Available</div>
                  <div className="font-medium">
                    {Object.entries(schedule)
                      .filter(([_, data]) => data.enabled)
                      .map(
                        ([day]) =>
                          day.slice(0, 3).charAt(0).toUpperCase() +
                          day.slice(1, 3),
                      )
                      .join(", ") || "Not Available"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center border border-[#EEEEEE] rounded-md">
                  <Globe size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Languages</div>
                  {isEditMode ? (
                    <Select onValueChange={(value) => toggleLanguage(value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue
                          placeholder={
                            selectedLanguages.length > 0
                              ? `${selectedLanguages.length} selected`
                              : "Add language"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "English",
                          "Hindi",
                          "Bengali",
                          "Urdu"
                        ].map((lang) => (
                          <SelectItem
                            key={lang}
                            value={lang}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {selectedLanguages.includes(lang) && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                              <span
                                className={
                                  selectedLanguages.includes(lang)
                                    ? "font-medium"
                                    : ""
                                }
                              >
                                {lang}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="font-medium">
                      {selectedLanguages.join(", ") || "Not specified"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditMode && selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedLanguages.map((language) => (
                  <Badge
                    key={language}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => toggleLanguage(language)}
                  >
                    {language}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {isEditMode && (
              <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-md">
                <Label htmlFor="isActive" className="text-base">
                  Active Status
                </Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            )}

            {isEditMode && (
              <div className="mt-4">
                <Label className="text-sm text-gray-500">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Email Address"
                />
              </div>
            )}
          </div>

          {/* About Section */}
          {(formData.bio || isEditMode) && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-2">About Doctor</h3>
              {isEditMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Enter doctor's bio"
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>
          )}

          {/* Areas of Expertise */}
          {(formData.specialization || isEditMode) && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold mb-3">Areas Of Expertise</h3>
              {isEditMode ? (
                <Input
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter specializations (comma separated)"
                  className="text-sm"
                />
              ) : (
                <ul className="list-disc pl-6 text-sm text-gray-600 space-y-2 capitalize">
                  {formData.specialization.split(",").map((item, index) => (
                    <li key={index}>{item.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Manage Availability */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-y-scroll relative no-scrollbar  ">
            <div
              className="bg-blue-50 p-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors sticky top-0 z-10"
              onClick={toggleAvailability}
            >
              <div className="flex items-center">
                <Check className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-600 font-medium">
                  Manage Availability
                </span>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-blue-600 transition-transform ${
                  showAvailability ? "rotate-90" : ""
                }`}
              />
            </div>

            {showAvailability && (
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Weekly Schedule
                </h3>
                {Object.entries(schedule).map(([day, dayData]) => (
                  <div key={day} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base capitalize font-medium">
                        {day}
                      </Label>
                      <Switch
                        checked={dayData.enabled}
                        disabled={!isEditMode}
                        onCheckedChange={() => handleToggleDay(day)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    {dayData.enabled ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={dayData.startTime || "09:00"}
                          onValueChange={(value) =>
                            handleTimeChange(day, "startTime", value)
                          }
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={`start-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-gray-500">to</span>

                        <Select
                          value={dayData.endTime || "17:00"}
                          onValueChange={(value) =>
                            handleTimeChange(day, "endTime", value)
                          }
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={`end-${time}`} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Not working on this day
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
