import { dashboardDepartmentEndpoints } from "./apis";
import { apiConnector, handleResponse } from "./core";

const {
  GET_ALL_DEPARTMENTS_API,
  ADD_DEPARTMENT_API,
  GET_DEPARTMENT_BY_ID_API,
  UPDATE_DEPARTMENT_API,
  DELETE_DEPARTMENT_API,
} = dashboardDepartmentEndpoints;

const department = {
  // Get all departments
  getAllDepartments: async () => {
    let response = null;
    try {
      console.log("Calling API:", GET_ALL_DEPARTMENTS_API);
      console.log("Full URL:", GET_ALL_DEPARTMENTS_API);
      response = await apiConnector("GET", GET_ALL_DEPARTMENTS_API);
      console.log("Raw API response:", response);
    } catch (error) {
      console.error("API call error:", error);
      response = error;
    }
    return handleResponse(response);
  },

  // Add new department
  addDepartment: async (departmentData) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_DEPARTMENT_API, departmentData);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    let response = null;
    try {
      const url = `${GET_DEPARTMENT_BY_ID_API}/${id}`;
      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    let response = null;
    try {
      const url = `${UPDATE_DEPARTMENT_API}/${id}`;
      response = await apiConnector("PUT", url, departmentData);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Delete department
  deleteDepartment: async (id) => {
    let response = null;
    try {
      const url = `${DELETE_DEPARTMENT_API}/${id}`;
      response = await apiConnector("DELETE", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default department;
