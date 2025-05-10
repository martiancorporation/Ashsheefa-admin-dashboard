import Image from "next/image";
import React from "react";
import { InPatitentTable } from "./components/InPatitentTable";

export default function page() {
  const data = [
    {
      icon: "/assets/images/internationalPatient/totalPatient.svg",
      name: "Total Inpatients Patients",
      value: "200",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/inPatient.svg",
      name: "Inpatient Patients",
      value: "100",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/emergency.svg",
      name: "Emergency Cases",
      value: "120",
      link: "",
    },
    {
      icon: "/assets/images/internationalPatient/discharged.svg",
      name: "Discharged Patients",
      value: "05",
      link: "",
    },
  ];
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
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium ">International Patient</p>
        </div>
      </div>

      <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        {data.map((data) => (
          <div
            key={data.name}
            className="w-full rounded-[10px] border border-[#D9D9D9] bg-[#F9F9F9] px-2  py-2 flex items-center gap-x-3 "
          >
            <div className="bg-[#FFFFFF] border border-[#D9D9D9]  rounded-[6px] flex items-center justify-center p-1.5">
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
                {/* {allDashboardData?.totalEnquiries} */}
                {data?.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <InPatitentTable />
    </>
  );
}
