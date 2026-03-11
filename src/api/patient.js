import { apiConnector, handleResponse } from "./core";
import { PATIENTS_API } from "./apis";

const {
  GET_ALL_PATIENTS,
  ADD_PATIENT,
  UPDATE_PATIENT,
  DELETE_PATIENT,
  GET_PATIENT_BY_ID,
  GET_PATIENT_DATA_BY_ID,
  UPLOAD_LAB_REPORT,
  GET_LAB_REPORTS,
  DELETE_LAB_REPORT,
  UPLOAD_PRESCRIPTION,
  GET_PRESCRIPTIONS,
  DELETE_PRESCRIPTION,
  GET_PATIENT_DOCUMENTS,
  GET_PATIENT_APPOINTMENTS,
} = PATIENTS_API;

const getAllPatients = async (params) => {
  let response = null;
  try {
    response = await apiConnector("GET", GET_ALL_PATIENTS, null, null, params);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const addPatient = async (data) => {
  let response = null;
  try {
    response = await apiConnector("POST", ADD_PATIENT, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const updatePatient = async (id, data) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${UPDATE_PATIENT}/${id}`, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deletePatient = async (id) => {
  let response = null;
  try {
    response = await apiConnector("DELETE", `${DELETE_PATIENT}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};


const getPatientDataById = async (id) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_PATIENT_DATA_BY_ID}/${id}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const uploadLabReport = async (patientId, data) => {
  let response = null;
  try {
    const url = `${UPLOAD_LAB_REPORT}/${patientId}`;

    response = await apiConnector("POST", url, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getLabReports = async (patientId) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_LAB_REPORTS}/${patientId}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const uploadPrescription = async (patientId, data) => {
  let response = null;
  try {
    const url = `${UPLOAD_PRESCRIPTION}/${patientId}`;
    response = await apiConnector("POST", url, data);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getPrescriptions = async (patientId) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_PRESCRIPTIONS}/${patientId}`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deleteLabReport = async (patientId, reportId) => {
  let response = null;
  try {
    response = await apiConnector(
      "DELETE",
      `${DELETE_LAB_REPORT}/${patientId}/${reportId}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const deletePrescription = async (appointmentId, prescriptionId) => {
  let response = null;
  try {
    response = await apiConnector(
      "DELETE",
      `${DELETE_PRESCRIPTION}/${appointmentId}/${prescriptionId}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getPatientDocuments = async (patientId) => {
  let response = null;
  try {
    response = await apiConnector(
      "GET",
      `${GET_PATIENT_DOCUMENTS}/${patientId}`
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const getPatientAppointments = async (patientId, params = {}) => {
  let response = null;

  try {
    response = await apiConnector(
      "GET",
      GET_PATIENT_APPOINTMENTS,
      null,
      null,
      { ...params, patientId }
    );
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const patient = {
  getAllPatients,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientDataById,
  uploadLabReport,
  getLabReports,
  deleteLabReport,
  uploadPrescription,
  getPrescriptions,
  deletePrescription,
  getPatientDocuments,
  getPatientAppointments,
};

export default patient;
