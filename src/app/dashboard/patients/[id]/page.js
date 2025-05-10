"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Upload, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientModal } from "../components/patient-modal";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export default function PatientDetailsPage({ params }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lab");

  // Mock patient data
  const patientData = {
    id: params.id,
    uhid: "123456",
    firstName: "Dulce",
    lastName: "Saris",
    fullName: "Dulce Saris",
    age: "23",
    gender: "Male",
    phone: "+91 2326454588",
    aadhaarNo: "7898 - 6565 - 6565",
    address: "123 Maplewood Lane, Springfield, Kolkata 62704",
    city: "Kolkata",
    state: "West Bengal",
    department: "Orthopedics",
    referralDoctor: "Dr. Hashim",
    appointmentDate: "23/12/2024",
    documents: [
      {
        id: 1,
        date: "17 Jan 2022",
        title: "Medical report of Rahul sing",
        hospital: "Ashsheefa hospital",
        doctor: "Dhiman sen",
      },
      {
        id: 2,
        date: "17 Jan 2022",
        title: "Medical report of Rahul sing",
        hospital: "Ashsheefa hospital",
        doctor: "Dhiman sen",
      },
    ],
  };

  return (
    <>
      <div className="flex justify-between items-center ">
        <div className="flex items-center  space-x-2 ">
          <Image
            width={100}
            height={100}
            src={"/assets/images/dashboard/leftArrow.svg"}
            alt="leftArrow"
            className="w-4 h-4"
          />
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <Breadcrumb>
            <BreadcrumbList className={`sm:gap-1`}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/patients">
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
            <Pencil className="h-4 w-4 " />
            Edit Patient
          </Button>
          <Button variant="outline" className="border-[#D9D9D9] text-[#FF0037]">
            <Trash2 className="h-4 w-4 " />
            Delete Patient
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll space-y-6">
        {/* Patients details  */}

        <Card className="rounded-[14px] border-[#E2E2E2] py-0 shadow-none">
          <div className="flex divide-x-2 divide-[#DDDDDD]">
            {/* Avatar and Name Section */}
            <CardContent className="w-[25%] p-4 flex flex-col items-center justify-center ">
              <div className="w-14 h-14 rounded-full bg-[#B4D5FF] flex items-center justify-center ">
                <span className="text-3xl font-bold text-white">
                  {patientData.fullName?.[0] || "A"}
                </span>
              </div>
              <h2 className="text-lg text-[#4B4B4B] font-semibold">
                {patientData.fullName}
              </h2>
              <p className="text-[#7F7F7F] text-sm ">
                Phone no. {patientData.phone}
              </p>
            </CardContent>

            {/* Details Section */}
            <CardContent className="w-[75%]  p-4">
              <div className="flex flex-wrap gap-7">
                <div>
                  <p className="text-sm text-[#7F7F7F]">Patient UHID</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.uhid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Age</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.age}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Gender</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Appointment Date</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.appointmentDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Department</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Referral Doctor</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.referralDoctor}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">Aadhaar No</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.aadhaarNo}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-[#7F7F7F]">Address</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">City</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#7F7F7F]">State</p>
                  <p className="font-medium text-[#4B4B4B]">
                    {patientData.state}
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
        {/* Patient documents  */}

        <Card className="rounded-[14px] shadow-none border-[#D9D9D9] py-0">
          <CardContent className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-[#323232] ">
                Patient Document
              </h2>
              {/* Tab Buttons */}
              <div className="flex gap-2 bg-[#F7F7F7] px-2 py-1 border border-[#DDDDDD] rounded-[10px]">
                <Button
                  variant={activeTab === "lab" ? "default" : "ghost"}
                  className={`rounded-md text-sm px-4 py-2 ${
                    activeTab === "lab"
                      ? "bg-[#005CD4] text-white"
                      : "text-[#414141]"
                  }`}
                  onClick={() => setActiveTab("lab")}
                >
                  Lab report
                </Button>
                <Button
                  variant={activeTab === "prescription" ? "default" : "ghost"}
                  className={`rounded-md text-sm px-4 py-2 ${
                    activeTab === "prescription"
                      ? "bg-[#0B5CF9] text-white"
                      : "text-[#4B4B4B]"
                  }`}
                  onClick={() => setActiveTab("prescription")}
                >
                  Prescription
                </Button>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patientData.documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="border border-[#EEEEEE] p-2.5 shadow-none rounded-[10px] bg-[#F6F6F6]"
                >
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <Image
                        src="/placeholder.svg?height=150&width=300"
                        alt="Medical report"
                        width={300}
                        height={150}
                        className="w-full h-auto rounded-md  bg-white"
                      />
                    </div>
                    <div className="border-b-[1.4px] border-[#CCCCCC] pb-2">
                      <p className="text-xs text-[#989898]">{doc.date}</p>
                      <h3 className="font-medium text-[#323232] ">
                        {doc.title}
                      </h3>
                      <p className="text-[13px] text-[#7F7F7F]">
                        By . {doc.hospital}
                      </p>
                      <p className="text-sm text-[#7F7F7F] ">
                        Doctor - {doc.doctor}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-none  bg-transparent shadow-none text-[#4B4B4B]"
                    >
                      View details
                      <ChevronRight />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Upload Box */}
              <Card className="border border-dashed border-[#BFBFBF] min-h-[250px] flex items-center justify-center text-center shadow-none">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="font-medium text-[#4B4B4B] mb-1">Upload More</p>
                  <p className="text-sm text-[#7F7F7F]">
                    File type: jpg, png, Pdf
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditModalOpen && (
        <PatientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isEdit={true}
          patientData={{
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            age: patientData.age,
            gender: patientData.gender.toLowerCase(),
            contactNumber: patientData.phone,
            aadhaarNo: patientData.aadhaarNo,
            address: patientData.address,
            city: patientData.city.toLowerCase(),
            state: patientData.state.toLowerCase().replace(" ", "-"),
            referralDoctor: patientData.referralDoctor
              .toLowerCase()
              .replace(". ", "-"),
            appointmentDate: "2024-12-23", // Format for date input
          }}
        />
      )}
    </>
  );
}
