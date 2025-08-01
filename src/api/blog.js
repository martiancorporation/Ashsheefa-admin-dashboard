import { dashboardBlogEndpoints } from "./apis";
import { apiConnector, handleResponse } from "./core";

const {
  GET_ALL_BLOG_DATA_API,
  GET_BLOG_DETAILS_API,
  UPDATE_BLOG_API,
  DELETE_BLOG_API,
  ADD_BLOG_API,
} = dashboardBlogEndpoints;

const blog = {
  getAllBlogs: async (data) => {
    let response = null;
    try {
      response = await apiConnector("GET", GET_ALL_BLOG_DATA_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  getBlogDetails: async (data) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        `${GET_BLOG_DETAILS_API}/${data?._id}`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  updateBlog: async (data, _id) => {
    let response = null;
    try {
      response = await apiConnector("PUT", `${UPDATE_BLOG_API}/${_id}`, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  addBlog: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ADD_BLOG_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  deleteBlog: async (data) => {
    let response = null;
    try {
      response = await apiConnector(
        "DELETE",
        `${DELETE_BLOG_API}/${data?._id}`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default blog;
