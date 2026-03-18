import { dashboardNewsEndpoints } from "./apis";
import { apiConnector, handleResponse } from "./core";

const {
  GET_ALL_NEWS_DATA_API,
  GET_NEWS_BY_ID_API,
  UPDATE_NEWS_API,
  DELETE_NEWS_API,
  ADD_NEWS_API,
} = dashboardNewsEndpoints;

const news = {
  getAllNews: async (data) => {
    let response = null;
    try {
      response = await apiConnector("GET", GET_ALL_NEWS_DATA_API);
    } catch (error) {
      console.error("API: Error getting all news:", error);
      response = error;
    }
    return handleResponse(response);
  },

  getNewsDetails: async (data) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        `${GET_NEWS_BY_ID_API}/${data?._id}`
      );
    } catch (error) {
      console.error("API: Error getting news details:", error);
      response = error;
    }
    return handleResponse(response);
  },

  updateNews: async (data, _id) => {
    let response = null;
    try {
      response = await apiConnector("PUT", `${UPDATE_NEWS_API}/${_id}`, data);
    } catch (error) {
      console.error("API: Error updating news:", error);
      response = error;
    }
    return handleResponse(response);
  },

  addNews: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_NEWS_API, data);
    } catch (error) {
      console.error("API: Error adding news:", error);
      response = error;
    }
    return handleResponse(response);
  },

  deleteNews: async (data) => {
    let response = null;
    try {
      response = await apiConnector(
        "DELETE",
        `${DELETE_NEWS_API}/${data?._id}`
      );
    } catch (error) {
      console.error("API: Error deleting news:", error);
      response = error;
    }
    return handleResponse(response);
  },
};

export default news;
