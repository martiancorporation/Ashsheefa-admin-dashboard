import { apiConnector, handleResponse } from "./core";
import { rolesEndpoints } from "./apis";

const { ROLES_API, ROLE_HISTORY_API } = rolesEndpoints;

/**
 * Role management APIs. Every endpoint here is superadmin-only on the backend.
 */
const roles = {
  ListRoles: async () => {
    let response = null;
    try {
      response = await apiConnector("GET", ROLES_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * @param {{ role: string, permission_keys?: string[] }} data
   */
  CreateRole: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", ROLES_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * @param {string} id
   * @param {{ role_label: string }} data
   */
  UpdateRole: async (id, data) => {
    let response = null;
    try {
      response = await apiConnector("PATCH", `${ROLES_API}/${id}`, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  DeleteRole: async (id) => {
    let response = null;
    try {
      response = await apiConnector("DELETE", `${ROLES_API}/${id}`);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetRolePermissions: async (id) => {
    let response = null;
    try {
      response = await apiConnector("GET", `${ROLES_API}/${id}/permissions`);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  SetRolePermissions: async (id, permission_keys) => {
    let response = null;
    try {
      response = await apiConnector("PUT", `${ROLES_API}/${id}/permissions`, {
        permission_keys,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetHistory: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", ROLE_HISTORY_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  RestoreRole: async (historyId) => {
    let response = null;
    try {
      response = await apiConnector(
        "POST",
        `${ROLE_HISTORY_API}/${historyId}/restore`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default roles;
