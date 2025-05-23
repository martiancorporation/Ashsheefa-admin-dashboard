"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InPatitentTable } from "./components/InPatitentTable";
import { InternationalPatientModal } from "./components/international-patient-modal";
import { FilterModal } from "./components/filter-modal";

export default function InternationalPatientPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState();

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
        <div className="flex items-center space-x-2">
          <Image
            width={100}
            height={100}
            src={"/assets/images/dashboard/leftArrow.svg"}
            alt="leftArrow"
            className="w-4 h-4"
          />
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">International Patient</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-[#4B4B4B]"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ListFilter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Patient
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.map((data) => (
            <div
              key={data.name}
              className="w-full rounded-[10px] border border-[#D9D9D9] bg-[#F9F9F9] px-2 py-2 flex items-center gap-x-3"
            >
              <div className="bg-[#FFFFFF] border border-[#D9D9D9] rounded-[6px] flex items-center justify-center p-1.5">
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
          ))}
        </div>

        <InPatitentTable
          searchQuery={searchQuery}
          activeFilters={activeFilters}
        />
      </div>

      {isAddModalOpen && (
        <InternationalPatientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={setActiveFilters}
        />
      )}
    </>
  );
}
