import { ChevronRight, Clock, Clock9, FileText, User } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const data = [
    {
      icon: "/assets/images/dashboard/totalPatient.svg",
      name: "Total Patients",
      value: "200",
      link: "",
    },
    {
      icon: "/assets/images/dashboard/patient.svg",
      name: "Today’s Patients",
      value: "100",
      link: "",
    },
    {
      icon: "/assets/images/dashboard/doctor.svg",
      name: "Total Doctors",
      value: "120",
      link: "",
    },
    {
      icon: "/assets/images/dashboard/department.svg",
      name: "Total Departments",
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
          <div className="w-[1.2px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium ">Dashboard</p>
        </div>
      </div>
      <div className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        {data.map((data) => (
          <div
            key={data.name}
            className="w-full rounded-[10px] border border-[#D9D9D9] bg-white  py-2 "
          >
            <div className="flex items-center gap-x-3 px-2 pb-2">
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
                  {/* {allDashboardData?.totalEnquiries} */}
                  {data?.value}
                </p>
              </div>
            </div>

            <div className="text-[#7F7F7F] text-xs border-t pt-3 flex items-center justify-center gap-1">
              <p>View details</p>
              <ChevronRight className="text-[#7F7F7F] w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
