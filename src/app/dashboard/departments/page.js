"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentCard } from "./components/department-card";
import { AddDepartmentModal } from "./components/add-department-modal";
import { toast } from "sonner";
import API from "@/api";

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'add' or 'edit'
  const [editingDepartment, setEditingDepartment] = useState(null);

  const filteredDepartments = departments.filter((dept) => {
    const displayName = (dept.department_name || dept.name || "").toLowerCase();
    return displayName.includes(searchQuery.toLowerCase());
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      // Check if we have authentication data
      const authData = localStorage.getItem("authentications");
      if (!authData) {
        console.error("No authentication data found");
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      const response = await API.department.getAllDepartments();

      // The API returns { departments: [...], pagination: {...} }
      if (response && response.departments) {
        const normalized = response.departments.map((d) => ({
          ...d,
          name: d.name || d.department_name,
          department_logo: d.department_logo || d.logo || d.icon || null,
          image: d.image || d.banner || null,
        }));
        setDepartments(normalized);
      } else if (response && response.data) {
        // Fallback for different response structure
        const normalized = response.data.map((d) => ({
          ...d,
          name: d.name || d.department_name,
          department_logo: d.department_logo || d.logo || d.icon || null,
          image: d.image || d.banner || null,
        }));
        setDepartments(normalized);
      } else {
        console.error("Unexpected response structure:", response);
        // For development/testing, show mock data if API fails
        const mockDepartments = [
          {
            _id: "mock-1",
            department_name: "Cardiology",
            logo: "/assets/images/department/cardiology.svg",
            is_active: true,
            description: "Heart and cardiovascular care",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "mock-2",
            department_name: "Neurology",
            logo: "/assets/images/department/neurology.svg",
            is_active: true,
            description: "Brain and nervous system care",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setDepartments(mockDepartments);
        toast.warning("Using mock data - API connection failed");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (data) => {
    try {
      const departmentData = { ...data };

      const response = await API.department.addDepartment(departmentData);

      // Handle different response structures
      if (
        response &&
        (response.success || response.department || response.message)
      ) {
        toast.success("Department added successfully");
        fetchDepartments(); // Refresh the list
        closeModal();
      } else {
        toast.error(response?.message || "Failed to add department");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Failed to add department");
    }
  };

  const handleEditDepartment = async (data) => {
    try {
      const departmentData = { ...data };

      const response = await API.department.updateDepartment(
        data.id,
        departmentData
      );

      // Handle different response structures
      if (
        response &&
        (response.success || response.department || response.message)
      ) {
        toast.success("Department updated successfully");
        fetchDepartments(); // Refresh the list
        closeModal();
      } else {
        toast.error(response?.message || "Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    }
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setModalType("edit");
  };

  const openAddModal = () => {
    console.log("openAddModal called");
    setEditingDepartment(null);
    setModalType("add");
  };

  const closeModal = () => {
    setModalType(null);
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await API.department.deleteDepartment(id);

      // Handle different response structures
      if (response && (response.success || response.message)) {
        toast.success("Department deleted successfully");
        fetchDepartments(); // Refresh the list
      } else {
        toast.error(response?.message || "Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    }
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
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
            onClick={fetchDepartments}
          >
            <ListFilter className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 ml-auto md:ml-0"
            onClick={() => {
              console.log("Add Department button clicked");
              openAddModal();
            }}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading departments...</div>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-lg font-medium mb-2">No departments found</div>
          <div className="text-sm">
            Create your first department to get started
          </div>
        </div>
      ) : (
        <div className="w-full  overflow-y-scroll overscroll-y-contain eme-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept._id || dept.id}
              department={dept}
              onDelete={handleDeleteDepartment}
              onEdit={handleEditDepartment}
              openEditModal={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Modal - only render when needed */}
      {modalType && (
        <AddDepartmentModal
          onSave={
            modalType === "edit" ? handleEditDepartment : handleAddDepartment
          }
          department={editingDepartment}
          open={true}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        />
      )}
    </>
  );
}
