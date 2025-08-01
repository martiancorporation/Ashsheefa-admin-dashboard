import { apiConnector, handleResponse } from "./core";
import { dashboardHealthCheckupEndpoints } from "./apis";

const {
  GET_ALL_HEALTH_CHECKUPS_API,
  ADD_HEALTH_CHECKUP_API,
  UPDATE_HEALTH_CHECKUP_API,
  DELETE_HEALTH_CHECKUP_API,
  GET_HEALTH_CHECKUP_BY_ID_API,
} = dashboardHealthCheckupEndpoints;

const healthCheckup = {
  // Get all health checkups
  getAllHealthCheckups: async (params = {}) => {
    let response = null;
    try {
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.category) queryParams.append("category", params.category);
      if (params.featured !== undefined)
        queryParams.append("featured", params.featured);
      if (params.is_active !== undefined)
        queryParams.append("is_active", params.is_active);

      const url = queryParams.toString()
        ? `${GET_ALL_HEALTH_CHECKUPS_API}?${queryParams.toString()}`
        : GET_ALL_HEALTH_CHECKUPS_API;

      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Add new health checkup
  addHealthCheckup: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_HEALTH_CHECKUP_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Update health checkup
  updateHealthCheckup: async (id, data) => {
    let response = null;
    try {
      const url = `${UPDATE_HEALTH_CHECKUP_API}/${id}`;
      response = await apiConnector("PUT", url, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Delete health checkup
  deleteHealthCheckup: async (id) => {
    let response = null;
    try {
      const url = `${DELETE_HEALTH_CHECKUP_API}/${id}`;
      response = await apiConnector("DELETE", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Get health checkup details by ID
  getHealthCheckupDetails: async (id) => {
    let response = null;
    try {
      const url = `${GET_HEALTH_CHECKUP_BY_ID_API}/${id}`;
      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default healthCheckup;
