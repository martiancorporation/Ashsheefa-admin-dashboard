import { apiConnector, handleResponse } from "./core";
import { EMERGENCY_SOS_API } from "./apis";

const { GET_ALL_SOS, RESOLVE_SOS } = EMERGENCY_SOS_API;

// GET /v1/dashboard/sos?page=&limit=
// Response: { status, total, page, limit, data: [
//   { _id, createdAt, patient_name, contact_number, address,
//     patient_details, triggered_by } ] }
const getAllEmergencySos = async (params) => {
  let response = null;
  try {
    response = await apiConnector("GET", GET_ALL_SOS, null, null, params);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const resolveEmergencySos = async (id) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${RESOLVE_SOS}/${id}/resolve`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const unresolveEmergencySos = async (id) => {
  let response = null;
  try {
    response = await apiConnector("PUT", `${RESOLVE_SOS}/${id}/unresolve`);
  } catch (error) {
    response = error;
  }
  return handleResponse(response);
};

const emergencySos = {
  getAllEmergencySos,
  resolveEmergencySos,
  unresolveEmergencySos,
};

export default emergencySos;
