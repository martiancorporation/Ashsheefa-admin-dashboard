import { apiConnector, handleResponse } from "./core";
import { INTERNATIONAL_PATIENT_API } from "./apis";

const {
  GET_ALL_INTERNATIONAL_PATIENTS,
  ADD_INTERNATIONAL_PATIENT,
  UPDATE_INTERNATIONAL_PATIENT,
  DELETE_INTERNATIONAL_PATIENT,
  GET_INTERNATIONAL_PATIENT_BY_ID,
  GET_INTERNATIONAL_PATIENT_STATS,
  GET_PATIENTS_BY_SPECIALITY,
} = INTERNATIONAL_PATIENT_API;

const getAllInternationalPatients = async (params) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      GET_ALL_INTERNATIONAL_PATIENTS,
      null,
      null,
      params
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const addInternationalPatient = async (data) => {
  let response = null;
  try {
    response = await apiConnector("POST", ADD_INTERNATIONAL_PATIENT, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const updateInternationalPatient = async (id, data) => {
  let response = null;
  try {
    response = await apiConnector(
      "PUT",
      `${UPDATE_INTERNATIONAL_PATIENT}/${id}`,
      data
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deleteInternationalPatient = async (id) => {
  let response = null;
  try {
    response = await apiConnector(
      "DELETE",
      `${DELETE_INTERNATIONAL_PATIENT}/${id}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getInternationalPatientDetails = async (id) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      `${GET_INTERNATIONAL_PATIENT_BY_ID}/${id}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getInternationalPatientStats = async () => {
  let response = null;
  try {
    response = await apiConnector("GET", GET_INTERNATIONAL_PATIENT_STATS);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getPatientsBySpeciality = async (speciality) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      `${GET_PATIENTS_BY_SPECIALITY}/${speciality}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const internationalPatient = {
  getAllInternationalPatients,
  addInternationalPatient,
  updateInternationalPatient,
  deleteInternationalPatient,
  getInternationalPatientDetails,
  getInternationalPatientStats,
  getPatientsBySpeciality,
};

export default internationalPatient;
