import { enquiryEndpoints } from "./apis";
import { apiConnector, handleResponse } from "./core";

const { GET_ALL_PATIENTS_ENQUIRY_API, ADD_PATIENTS_ENQUIRY_API } =
  enquiryEndpoints;

const patientsEnquiry = {
  getAllPatientsEnquiry: async (page = 1, limit = 15) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        `${GET_ALL_PATIENTS_ENQUIRY_API}?page=${page}&limit=${limit}`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  addPatientsEnquiry: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_PATIENTS_ENQUIRY_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default patientsEnquiry;
