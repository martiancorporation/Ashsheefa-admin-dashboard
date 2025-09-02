"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddDepartmentModal } from "../components/add-department-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import API from "@/api";

export default function DepartmentDetailsPage({ params }) {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const res = await API.department.getDepartmentById(params.id);
        // Support multiple API shapes
        const dept = res?.department || res?.data || res;
        if (dept) setDepartment(dept);
      } catch (e) {
        console.error("Failed to load department", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDept();
  }, [params.id]);

  const doctors = department?.doctors || [];
  const patients = department?.patients || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteDepartment = async () => {
    try {
      await API.department.deleteDepartment(
        department?._id || department?.id || params.id
      );
      // TODO: redirect after delete if needed
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleEditDepartment = (data) => {
    setDepartment((prev) => ({ ...(prev || {}), ...data }));
  };

  return (
    <>
      <div className="w-full flex items-center justify-between ">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/departments"
            className="flex items-center text-gray-600 mr-2"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Link>
          <Breadcrumb>
            <BreadcrumbList className={`sm:gap-1`}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/departments">
                  Department
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Department Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleDeleteDepartment}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Department
          </Button>

          <AddDepartmentModal
            department={department}
            onSave={handleEditDepartment}
          >
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Department
            </Button>
          </AddDepartmentModal>
        </div>
      </div>

      <section className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll space-y-4 ">
        <Card className="rounded-[14px] border-[#E2E2E2] py-4 px-4 shadow-none">
          {loading ? (
            <div className="text-gray-500">Loading department...</div>
          ) : !department ? (
            <div className="text-gray-500">Department not found.</div>
          ) : (
            <div className="flex justify-start items-start gap-8">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      department?.department_logo ||
                      department?.logo ||
                      department?.icon ||
                      "/assets/images/department/oncology.svg"
                    }
                    alt={
                      department?.name ||
                      department?.department_name ||
                      "department"
                    }
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base text-[#323232] font-medium truncate">
                    {(department?.name || department?.department_name) +
                      " Department"}
                  </h1>
                  {department?.label && (
                    <p className="text-xs text-[#7F7F7F] truncate">
                      {department.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex gap-2 items-center">
                  <div className="bg-[#FFFFFF] border border-[#EEEEEE] rounded-[6px] flex items-center justify-center p-1.5">
                    <Image
                      src="/assets/images/dashboard/doctor.svg"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="totalPatient"
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <p className="text-[#7F7F7F] text-sm">Total Doctors</p>
                    <p className="text-base font-medium text-[#4B4B4B]">
                      {department?.total_doctors ??
                        department?.doctorsCount ??
                        doctors.length}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="bg-[#FFFFFF] border border-[#EEEEEE] rounded-[6px] flex items-center justify-center p-1.5">
                    <Image
                      src="/assets/images/dashboard/totalPatient.svg"
                      width={100}
                      height={100}
                      className="w-6 h-6"
                      alt="totalPatient"
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <p className="text-[#7F7F7F] text-sm">Total Patients</p>
                    <p className="text-base font-medium text-[#4B4B4B]">
                      {department?.total_patients ??
                        department?.patientsCount ??
                        patients.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {!loading && department?.image && (
          <Card className="rounded-[14px] border-[#E2E2E2] p-0 shadow-none overflow-hidden">
            <Image
              src={department.image}
              alt="Department Banner"
              width={1200}
              height={300}
              className="w-full h-[200px] object-cover"
            />
          </Card>
        )}

        {!loading && department && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-[14px] border-[#E2E2E2] p-4 shadow-none space-y-3">
              <h3 className="text-sm font-medium text-[#4B4B4B]">About</h3>
              {department?.title && (
                <div>
                  <p className="text-xs text-[#7F7F7F]">Title</p>
                  <p className="text-sm text-[#323232]">{department.title}</p>
                </div>
              )}
              {department?.description && (
                <div>
                  <p className="text-xs text-[#7F7F7F]">Description</p>
                  <p className="text-sm text-[#323232] whitespace-pre-wrap">
                    {department.description}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7F7F7F]">Status</span>
                <span className="text-[#323232]">
                  {department?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </Card>

            <Card className="rounded-[14px] border-[#E2E2E2] p-4 shadow-none space-y-3">
              <h3 className="text-sm font-medium text-[#4B4B4B]">Treatments</h3>
              {department?.treatment_title && (
                <div>
                  <p className="text-xs text-[#7F7F7F]">Title</p>
                  <p className="text-sm text-[#323232]">
                    {department.treatment_title}
                  </p>
                </div>
              )}
              {department?.treatment_description && (
                <div>
                  <p className="text-xs text-[#7F7F7F]">Description</p>
                  <p className="text-sm text-[#323232] whitespace-pre-wrap">
                    {department.treatment_description}
                  </p>
                </div>
              )}
              {Array.isArray(department?.list_of_services) &&
                department.list_of_services.length > 0 && (
                  <div>
                    <p className="text-xs text-[#7F7F7F] mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {department.list_of_services.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </Card>
          </div>
        )}

        <Tabs defaultValue="doctors" className="w-full  ">
          <TabsList className="mb-6 ">
            <TabsTrigger value="doctors">
              All Doctors (
              {department?.total_doctors ??
                department?.doctorsCount ??
                doctors.length}
              )
            </TabsTrigger>
            <TabsTrigger value="patients">
              All Patients (
              {department?.total_patients ??
                department?.patientsCount ??
                patients.length}
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg shadow-none p-4 border border-[#E2E2E2]"
                >
                  <div className="flex items-center gap-4 ">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={
                            doctor.profilePic ||
                            doctor.photo ||
                            "/placeholder.svg"
                          }
                          alt={doctor.fullName || doctor.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      {doctor.available && (
                        <div className="absolute -top-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {doctor.fullName || doctor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doctor.specialty || doctor.specialization || ""}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.regNo || ""}
                      </p>
                    </div>
                  </div>

                

                 
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Patient Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Age/Gender
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Appointment Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Status
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id || patient.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {patient.patient_full_name || patient.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {patient.age}/{patient.gender}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatDate(patient.appointment_date)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {patient.status || "-"}
                        </td>
                         
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
