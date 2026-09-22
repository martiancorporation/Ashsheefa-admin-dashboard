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
  // Get all departments with pagination
  /**
   * @param {number} page
   * @param {number} limit
   * @param {object} [options] - forwarded to handleResponse, e.g.
   *   `{ silentStatuses: [403] }` when the caller only wants the names as
   *   reference data and can cope without them.
   */
  getAllDepartments: async (page = 1, limit = 10, options = {}) => {
    let response = null;
    try {
      const url = `${GET_ALL_DEPARTMENTS_API}?page=${page}&limit=${limit}`;
      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response, options);
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
