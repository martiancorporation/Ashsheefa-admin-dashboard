import { useEffect, useState } from "react";
import API from "@/api";

const FALLBACK_DEPARTMENTS = [
  "Ortho",
  "Cardiology",
  "Neurology",
  "Oncology",
  "General Surgery",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "ENT",
  "Ophthalmology",
  "Psychiatry",
  "Radiology",
  "Anesthesiology",
  "Emergency Medicine",
  "Internal Medicine",
  "Cardiac Science",
];

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.department.getAllDepartments(1, 100);

      let departmentNames = [];

      if (response?.departments) {
        departmentNames = response.departments
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
      } else if (response?.data) {
        departmentNames = response.data
          .map((dept) => dept.name || dept.department_name || dept.label)
          .filter(Boolean);
      }

      setDepartments(departmentNames.length ? departmentNames : FALLBACK_DEPARTMENTS);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err);
      setDepartments(FALLBACK_DEPARTMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments,
  };
};