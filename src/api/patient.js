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

const getPatientDetails = async (id) => {
  let response = null;
  try {
    response = await apiConnector("GET", `${GET_PATIENT_BY_ID}/${id}`);
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
    console.log("Upload Lab Report URL:", url);
    console.log("Patient ID:", patientId);

    // Check if data is FormData
    if (data instanceof FormData) {
      console.log("Upload data is FormData");
      console.log("FormData entries:");
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
    } else {
      console.log("Upload data:", data);
    }

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
    console.log("Upload Prescription URL:", url);
    console.log("Patient ID:", patientId);

    // Check if data is FormData
    if (data instanceof FormData) {
      console.log("Upload data is FormData");
      console.log("FormData entries:");
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }
    } else {
      console.log("Upload data:", data);
    }

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

const deletePrescription = async (patientId, prescriptionId) => {
  let response = null;
  try {
    response = await apiConnector(
      "DELETE",
      `${DELETE_PRESCRIPTION}/${patientId}/${prescriptionId}`
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

const patient = {
  getAllPatients,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientDetails,
  getPatientDataById,
  uploadLabReport,
  getLabReports,
  deleteLabReport,
  uploadPrescription,
  getPrescriptions,
  deletePrescription,
  getPatientDocuments,
};

export default patient;
