import { apiConnector, handleResponse } from "./core";
import { dashboardDoctorEndpoints } from "./apis";

const {
  GET_ALL_DOCTORS_DATA_API,
  ADD_DOCTOR_DATA_API,
  GET_DOCTOR_BY_ID_API,
  UPDATE_DOCTOR_DATA_API,
  DELETE_DOCTOR_DATA_API,
} = dashboardDoctorEndpoints;

const doctor = {
  // Get all doctors data with pagination
  getAllDoctors: async (page = 1, limit = 15) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        `${GET_ALL_DOCTORS_DATA_API}?page=${page}&limit=${limit}`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Get doctor by id (fetch full details including availability)
  getDoctorById: async (id) => {
    let response = null;
    try {
      const url = `${GET_DOCTOR_BY_ID_API}/${id}`;
      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Add new doctor data
  addDoctor: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_DOCTOR_DATA_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Update doctor data
  updateDoctor: async (data) => {
    let response = null;
    try {
      // data can be a plain object OR FormData (when uploading a new photo)
      const _id = data instanceof FormData ? data.get("_id") : data._id;
      const url = `${UPDATE_DOCTOR_DATA_API}/${_id}`;
      response = await apiConnector("PUT", url, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  // Delete doctor data
  deleteDoctor: async (doctorId) => {
    let response = null;
    try {
      const url = `${DELETE_DOCTOR_DATA_API}/${doctorId}`;
      response = await apiConnector("DELETE", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default doctor;
