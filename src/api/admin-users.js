import { apiConnector, handleResponse } from "./core";
import { adminUsersEndpoints } from "./apis";

const { USERS_API, USER_HISTORY_API, DELETED_USERS_API } = adminUsersEndpoints;

/**
 * Admin user management APIs. Every endpoint here is superadmin-only on the backend.
 */
const adminUsers = {
  ListUsers: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", USERS_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  CreateUser: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", USERS_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  UpdateUser: async (id, data) => {
    let response = null;
    try {
      response = await apiConnector("PATCH", `${USERS_API}/${id}`, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  DeleteUser: async (id) => {
    let response = null;
    try {
      response = await apiConnector("DELETE", `${USERS_API}/${id}`);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetDeletedUsers: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", DELETED_USERS_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  RestoreUser: async (id) => {
    let response = null;
    try {
      response = await apiConnector("POST", `${USERS_API}/${id}/restore`);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetHistory: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", USER_HISTORY_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default adminUsers;
