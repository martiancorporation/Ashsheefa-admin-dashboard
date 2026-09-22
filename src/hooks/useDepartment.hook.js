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

/**
 * Department names, for filter dropdowns.
 *
 * This is reference data, not the Departments drawer: an admin who can see
 * Appointments but not Departments still needs the speciality filter to work.
 * The read is gated on the departments drawer server-side, so a 403 here is a
 * normal outcome rather than a fault — it is asked for quietly and falls back
 * to the static list, instead of throwing an "Access denied" toast at someone
 * who did nothing wrong.
 */
export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.department.getAllDepartments(1, 100, {
        silentStatuses: [403],
      });

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