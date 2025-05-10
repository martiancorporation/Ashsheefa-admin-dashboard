"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Filter, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentCard } from "./components/department-card";
import { AddDepartmentModal } from "./components/add-department-modal";

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([
    {
      id: "cardiology",
      name: "Cardiology",
      icon: "/assets/images/department/cardiology.svg",
      doctorsCount: 12,
      patientsCount: 23,
    },
    {
      id: "neurology",
      name: "Neurology",
      icon: "/assets/images/department/neurology.svg",
      doctorsCount: 12,
      patientsCount: 23,
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      icon: "/assets/images/department/orthopedics.svg",
      doctorsCount: 12,
      patientsCount: 40,
    },
    {
      id: "urology",
      name: "Urology",
      icon: "/assets/images/department/urology.svg",
      doctorsCount: 8,
      patientsCount: 15,
    },
    {
      id: "oncology",
      name: "Oncology",
      icon: "/assets/images/department/oncology.svg",
      doctorsCount: 10,
      patientsCount: 30,
    },
  ]);

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = (data) => {
    setDepartments([...departments, data]);
  };

  const handleEditDepartment = (data) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === data.id ? { ...dept, ...data } : dept
      )
    );
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <>
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Department</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[320px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-[#4B4B4B]"
          >
            <ListFilter className="h-4 w-4" />
            Filter
          </Button>
          <AddDepartmentModal onSave={handleAddDepartment}>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </AddDepartmentModal>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDepartments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onDelete={handleDeleteDepartment}
            onEdit={handleEditDepartment}
          />
        ))}
      </div>
    </>
  );
}
