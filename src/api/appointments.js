import { apiConnector, handleResponse } from "./core";
import { APPOINTMENTS_API } from "./apis";

const {
  GET_ALL_APPOINTMENTS,
  ADD_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
  GET_APPOINTMENT_BY_ID,
  AVAILABLE_SLOTS_API,
  GET_ALL_APPOINTMENTS_WITHOUT_PAGINATION,
} = APPOINTMENTS_API;

const getAllAppointments = async (params) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      GET_ALL_APPOINTMENTS,
      null,
      null,
      params,
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getAllAppointmentsWithoutPagination = async (params) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      GET_ALL_APPOINTMENTS_WITHOUT_PAGINATION,
      params,
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const addAppointment = async (data) => {
  let response = null;
  try {
    response = await apiConnector("POST", ADD_APPOINTMENT, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const updateAppointment = async (id, data) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${UPDATE_APPOINTMENT}/${id}`, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deleteAppointment = async (id) => {
  let response = null;
  try {
    response = await apiConnector("DELETE", `${DELETE_APPOINTMENT}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getAppointmentDetails = async (id) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_APPOINTMENT_BY_ID}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getAvailableSlots = async (doctorId, dateStr) => {
  try {
    const url = `${AVAILABLE_SLOTS_API}?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(dateStr)}&interval=30`;
    const response = await apiConnector("GET", url);
    if (response?.data?.success) {
      return (response.data.booked || []).map((s) => s.start);
    }
    return [];
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
};

const appointments = {
  getAllAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentDetails,
  getAvailableSlots,
  getAllAppointmentsWithoutPagination,
};

export default appointments;
