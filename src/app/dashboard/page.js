"use client";

import { ChevronRight, Clock, Clock9, FileText, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EnquiryAppointmentBarChart } from "./components/enquiry-appointment-chart";
import { VisitorAreaChart } from "./components/visitor-area-chart";
import { DepartmentDoctorPieChart } from "./components/department-doctor-pie-chart";
import API from "@/api";

export default function Page() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await API.dashboard.getDashboardData();
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const data = [
    {
      icon: "/assets/images/dashboard/totalPatient.svg",
      name: "Total Patients",
      value: dashboardData?.totalCounts?.patients || "0",
      link: "/dashboard/patient",
    },
    {
      icon: "/assets/images/dashboard/patient.svg",
      name: "Total International Patients",
      value: dashboardData?.totalCounts?.internationalPatients || "0",
      link: "/dashboard/international-patients",
    },
    {
      icon: "/assets/images/dashboard/doctor.svg",
      name: "Total Doctors",
      value: dashboardData?.totalCounts?.doctors || "0",
      link: "/dashboard/doctors",
    },
    {
      icon: "/assets/images/dashboard/department.svg",
      name: "Total Departments",
      value: dashboardData?.totalCounts?.departments || "0",
      link: "/dashboard/departments",
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              Loading Dashboard
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we fetch your data...
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center  space-x-2 ">
          <Image
            width={100}
            height={100}
            src={"/assets/images/dashboard/leftArrow.svg"}
            alt="leftArrow"
            className="w-4 h-4"
          />
          <div className="w-[1.2px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium ">Dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-0">
        {data.map((data) => (
          <div
            key={data.name}
            className="w-full rounded-[10px] border border-[#D9D9D9] bg-white  py-1 "
          >
            <div className="flex items-center gap-x-2 px-2 pb-1">
              <div className="bg-[#F7F7F7] border border-[#D9D9D9]  rounded-[6px] flex items-center justify-center p-1.5">
                <Image
                  src={data?.icon}
                  width={100}
                  height={100}
                  className="w-6 h-6"
                  alt="totalPatient"
                />
              </div>
              <div>
                <p className="text-[#636363] text-sm">{data?.name}</p>
                <p className="text-[#323232] text-[18px] font-bold">
                  {data?.value}
                </p>
              </div>
            </div>

            {/* <Link
              href={data?.link}
              className="text-[#7F7F7F] text-xs border-t pt-1 flex items-center justify-center gap-1 hover:text-[#000] hover:underline cursor-pointer"
            >
              View details
              <ChevronRight className="text-[#7F7F7F] w-5 h-5" />
            </Link> */}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="w-full h-[calc(100%-50px)] overflow-y-scroll overscroll-y-contain eme-scroll  space-y-2">
        {/* First Row - Visitor Area Chart */}
        <div className="w-full">
          <VisitorAreaChart
            allDashboardData={{
              chartData: dashboardData?.charts?.visitorAreaChart?.monthly || [],
            }}
          />
        </div>

        {/* Second Row - Two Charts Side by Side */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          <EnquiryAppointmentBarChart
            data={dashboardData?.charts?.enquiryAppointmentBarChart || []}
          />
          <DepartmentDoctorPieChart
            data={dashboardData?.charts?.departmentDoctorPieChart || []}
          />
        </div>

        {/* Third Row - Original Visitor Chart */}
        {/* <div className="w-full">
          <VisitorChart
            data={dashboardData?.charts?.visitorAreaChart?.monthly || []}
          />
        </div> */}
      </div>
    </>
  );
}
