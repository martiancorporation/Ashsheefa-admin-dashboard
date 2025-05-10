"use client";

import { useState } from "react";
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

export default function DepartmentDetailsPage({ params }) {
  // In a real application, you would fetch the department data based on the ID
  const [department, setDepartment] = useState({
    id: params.id,
    name: "Neurology",
    icon: "/assets/images/department/neurology.svg",
    doctorsCount: 12,
    patientsCount: 23,
  });

  const doctors = [
    {
      id: 1,
      name: "DR. ANIRBAN SAHA MBBD",
      specialty: "MD (Anesthesiology)",
      regNo: "Reg No. 64306 (WBMC)",
      experience: "16+ Years",
      languages: ["English", "Hindi", "Bengali"],
      available: true,
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "DR. SUNANDA JANA MBBS",
      specialty: "MD, DNB (Cardiology)",
      regNo: "Reg. No. 64394",
      experience: "16+ Years",
      languages: ["English", "Hindi", "Bengali"],
      available: true,
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "DR. BARNAVA PAL MBBS",
      specialty: "DNB (Anesthesiology)",
      regNo: "Reg. No. 66083",
      experience: "16+ Years",
      languages: ["English", "Hindi", "Bengali"],
      available: true,
      photo: "/placeholder.svg?height=100&width=100",
    },
  ];

  const patients = [
    {
      id: 1,
      name: "Olivia Rhye",
      age: 28,
      gender: "Female",
      appointmentDate: "10 Jan 2025",
      doctor: "Dr. Anirban Saha",
    },
    {
      id: 2,
      name: "Phoenix Baker",
      age: 35,
      gender: "Male",
      appointmentDate: "12 Jan 2025",
      doctor: "Dr. Sunanda Jana",
    },
    {
      id: 3,
      name: "Lana Steiner",
      age: 42,
      gender: "Female",
      appointmentDate: "15 Jan 2025",
      doctor: "Dr. Barnava Pal",
    },
  ];

  const handleDeleteDepartment = () => {
    console.log("Delete department with ID:", params.id);
    // Here you would delete the department and redirect
  };

  const handleEditDepartment = (data) => {
    setDepartment({ ...department, ...data });
  };

  return (
    <>
      <div className="w-full flex items-center justify-between ">
        <div className="flex items-center mb-6">
          <Link
            href="/departments"
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
          <div className="flex  justify-start items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={department.icon || "/placeholder.svg"}
                  alt={department.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-base text-[#323232] font-medium">
                  {department.name} Department
                </h1>
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
                    {department.doctorsCount}
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
                    {department.patientsCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="doctors" className="w-full  ">
          <TabsList className="mb-6 ">
            <TabsTrigger value="doctors">
              All Doctors ({department.doctorsCount})
            </TabsTrigger>
            <TabsTrigger value="patients">
              All Patients ({department.patientsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={doctor.photo || "/placeholder.svg"}
                          alt={doctor.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {doctor.available && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">
                        {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-500">{doctor.regNo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span>{doctor.languages[0]}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
                    >
                      View Details
                    </Button>
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
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {patient.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {patient.age}/{patient.gender}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {patient.appointmentDate}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {patient.doctor}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                          >
                            View Details
                          </Button>
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
